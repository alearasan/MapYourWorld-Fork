/**
 * Servicio de Notificaciones de MapYourWorld
 * Gestiona notificaciones en tiempo real mediante WebSockets
 */

import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connect as connectRabbitMQ, subscribeToEvents } from '@shared/libs/rabbitmq';
import { SecureWebSocketServer } from '@shared/websocket/secure-websocket';
import { verifyToken } from '@shared/config/jwt.config';

// Cargar variables de entorno
dotenv.config();

// Inicializar la app Express
const app = express();
const PORT = process.env.PORT || 3004;

// Crear servidor HTTP (necesario para WebSockets)
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del WebSocket seguro
const wsServer = new SecureWebSocketServer(server, {
  path: '/notifications',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  requireAuth: true,
  useEncryption: true
});

// Almacenamiento en memoria de las notificaciones y conexiones
type NotificationRoom = { [userId: string]: string[] }; // userId -> roomIds[]
const userRooms: NotificationRoom = {};
const adminUsers: string[] = [];

// Ruta de salud para verificar que el servicio está funcionando
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'notification-service',
    status: 'operational',
    version: '1.0.0',
    connections: Object.keys(userRooms).length
  });
});

// Verificar token JWT
app.post('/api/notifications/verify-token', (req: Request, res: Response) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token no proporcionado' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
  
  res.status(200).json({ success: true, user: decoded });
});

// Iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a RabbitMQ
    await connectRabbitMQ();
    
    // Suscribirse a eventos relevantes
    await subscribeToEvents(
      'notification-service',
      [
        'user.registered',
        'user.loggedin',
        'district.unlocked',
        'photo.uploaded',
        'comment.created',
        'like.added'
      ],
      async (content, routingKey) => {
        console.log(`Evento recibido: ${routingKey}`, content);
        
        // Procesar diferentes tipos de eventos
        await processEvent(routingKey, content);
      }
    );
    
    // Iniciar servidor HTTP
    server.listen(PORT, () => {
      console.log(`✅ Servicio de notificaciones ejecutándose en el puerto ${PORT}`);
    });
    
    // Configurar manejadores de WebSocket
    setupWebSocketHandlers();
  } catch (error) {
    console.error('❌ Error al iniciar el servicio de notificaciones:', error);
    process.exit(1);
  }
};

/**
 * Configura los manejadores específicos de eventos WebSocket
 */
const setupWebSocketHandlers = () => {
  const io = wsServer.getServer();
  
  io.on('connection', (socket: any) => {
    // El usuario ya está autenticado gracias al middleware de SecureWebSocketServer
    const userId = socket.user?.userId;
    
    if (userId) {
      // Registrar la conexión
      if (!userRooms[userId]) {
        userRooms[userId] = [];
      }
      
      // Mantener track del usuario y sus salas
      const userRoom = `user:${userId}`;
      userRooms[userId].push(userRoom);
      
      // Si el usuario es admin, añadirlo a la lista de admins
      if (socket.user?.role === 'admin') {
        adminUsers.push(userId);
      }
      
      console.log(`Usuario ${userId} conectado con socket ${socket.id}`);
      
      // Enviar notificaciones pendientes (si las hubiera)
      sendPendingNotifications(userId);
    }
    
    // Cuando el usuario se desconecta
    socket.on('disconnect', () => {
      if (userId && userRooms[userId]) {
        // Limpiar si no quedan conexiones
        if (wsServer.isUserConnected(userId) === false) {
          delete userRooms[userId];
          
          // Eliminar de la lista de admins si aplica
          const adminIndex = adminUsers.indexOf(userId);
          if (adminIndex >= 0) {
            adminUsers.splice(adminIndex, 1);
          }
        }
        
        console.log(`Usuario ${userId} desconectado (socket ${socket.id})`);
      }
    });
    
    // Suscribirse a un tipo específico de notificación
    socket.on('subscribe', (data: { type: string }) => {
      if (userId) {
        const roomId = `${data.type}:${userId}`;
        if (!userRooms[userId].includes(roomId)) {
          userRooms[userId].push(roomId);
        }
        console.log(`Usuario ${userId} suscrito a ${data.type}`);
      }
    });
    
    // Cancelar suscripción a un tipo específico de notificación
    socket.on('unsubscribe', (data: { type: string }) => {
      if (userId && userRooms[userId]) {
        const roomId = `${data.type}:${userId}`;
        userRooms[userId] = userRooms[userId].filter(id => id !== roomId);
        console.log(`Usuario ${userId} canceló suscripción a ${data.type}`);
      }
    });
  });
};

/**
 * Procesa un evento y envía notificaciones apropiadas
 * @param routingKey Tipo de evento
 * @param content Contenido del evento
 */
const processEvent = async (routingKey: string, content: any) => {
  switch (routingKey) {
    case 'user.registered':
      // Notificar a los administradores sobre un nuevo registro
      adminUsers.forEach(adminId => {
        wsServer.sendToUser(adminId, 'notification', {
          type: 'new_user',
          message: `Nuevo usuario registrado: ${content.email}`,
          data: content
        });
      });
      break;
      
    case 'district.unlocked':
      // Notificar al usuario que ha desbloqueado un distrito
      if (content.userId) {
        wsServer.sendToUser(content.userId, 'notification', {
          type: 'district_unlocked',
          message: `¡Has desbloqueado el distrito ${content.districtName}!`,
          data: content
        });
      }
      break;
      
    case 'photo.uploaded':
      // Notificar a los seguidores sobre una nueva foto
      if (content.followers && Array.isArray(content.followers)) {
        content.followers.forEach((followerId: string) => {
          wsServer.sendToUser(followerId, 'notification', {
            type: 'new_photo',
            message: `${content.userName} ha subido una nueva foto`,
            data: content
          });
        });
      }
      break;
      
    case 'comment.created':
      // Notificar al propietario de la foto sobre un nuevo comentario
      if (content.photoOwnerId) {
        wsServer.sendToUser(content.photoOwnerId, 'notification', {
          type: 'new_comment',
          message: `${content.commenterName} ha comentado tu foto`,
          data: content
        });
      }
      break;
      
    case 'like.added':
      // Notificar al propietario de la foto sobre un nuevo like
      if (content.photoOwnerId) {
        wsServer.sendToUser(content.photoOwnerId, 'notification', {
          type: 'new_like',
          message: `A ${content.likerName} le ha gustado tu foto`,
          data: content
        });
      }
      break;
      
    default:
      console.log(`Evento no procesado: ${routingKey}`);
  }
};

/**
 * Envía notificaciones pendientes a un usuario
 * @param userId ID del usuario
 */
const sendPendingNotifications = async (userId: string) => {
  // Aquí se implementaría la lógica para obtener notificaciones pendientes
  // desde una base de datos y enviarlas al usuario
  
  // Ejemplo simple:
  wsServer.sendToUser(userId, 'notification', {
    type: 'welcome_back',
    message: '¡Bienvenido de nuevo a MapYourWorld!',
    data: { timestamp: new Date().toISOString() }
  });
};

// Iniciar el servidor
startServer(); 