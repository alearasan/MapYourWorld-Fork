/**
 * Controlador de WebSockets para la comunicación en tiempo real
 * Integra clientes móviles y web con el sistema de mensajería de RabbitMQ
 */

import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';
import * as jwt from 'jsonwebtoken';
import messagingService, { EventType, Event } from '../services/messaging-service';

// Mapa para almacenar las conexiones activas
type WebSocketClients = Map<string, {
  socket: WebSocket,
  userId?: string,
  deviceId?: string,
  lastActivity: number
}>;

// Estructura de los mensajes WebSocket
interface WebSocketMessage {
  type: string;
  data: any;
  token?: string;
}

class WebSocketController {
  private wss: WebSocket.Server | null = null;
  private clients: WebSocketClients = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  /**
   * Inicializa el controlador WebSocket
   * @param server Servidor HTTP para montar el servidor WebSocket
   */
  initialize(server: Server): void {
    this.wss = new WebSocket.Server({ server, path: '/api/ws' });
    
    this.wss.on('connection', this.handleConnection.bind(this));
    
    console.log('[WebSocket] Servidor WebSocket inicializado');
    
    // Iniciar el heartbeat para mantener conexiones activas
    this.startHeartbeat();
  }
  
  /**
   * Maneja una nueva conexión WebSocket
   * @param ws Conexión WebSocket
   * @param req Solicitud HTTP entrante
   */
  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    // Generar un ID único para la conexión
    const connectionId = Date.now().toString() + Math.random().toString(36).substring(2, 10);
    
    // Guardar la conexión
    this.clients.set(connectionId, {
      socket: ws,
      lastActivity: Date.now()
    });
    
    console.log(`[WebSocket] Nueva conexión establecida: ${connectionId}`);
    
    // Enviar mensaje de bienvenida
    this.sendToClient(connectionId, {
      type: 'connection',
      status: 'connected',
      connectionId
    });
    
    // Configurar handlers
    ws.on('message', (message: WebSocket.Data) => {
      this.handleMessage(connectionId, message);
    });
    
    ws.on('close', () => {
      this.handleClose(connectionId);
    });
    
    ws.on('error', (error) => {
      console.error(`[WebSocket] Error en conexión ${connectionId}:`, error);
      this.clients.delete(connectionId);
    });
    
    // Enviar ping para mantener la conexión activa
    this.sendPing(connectionId);
  }
  
  /**
   * Maneja un mensaje entrante de un cliente WebSocket
   * @param connectionId ID de la conexión
   * @param message Mensaje recibido
   */
  private handleMessage(connectionId: string, message: WebSocket.Data): void {
    try {
      const client = this.clients.get(connectionId);
      if (!client) return;
      
      // Actualizar timestamp de actividad
      client.lastActivity = Date.now();
      
      // Parsear el mensaje
      const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
      
      console.log(`[WebSocket] Mensaje recibido de ${connectionId}:`, parsedMessage.type);
      
      // Autenticar al usuario si se proporciona un token
      if (parsedMessage.token && !client.userId) {
        this.authenticateClient(connectionId, parsedMessage.token);
      }
      
      // Procesar mensaje según su tipo
      switch (parsedMessage.type) {
        case 'auth':
          // Autenticar al cliente
          if (parsedMessage.data.token) {
            this.authenticateClient(connectionId, parsedMessage.data.token);
          }
          break;
          
        case 'subscribe':
          // Suscribir al cliente a eventos
          // La implementación dependerá de los eventos disponibles
          break;
          
        case 'ping':
          // Responder al ping
          this.sendToClient(connectionId, { type: 'pong', timestamp: Date.now() });
          break;
          
        case 'event':
          // Procesar evento recibido desde el cliente
          if (client.userId) {
            // Solo procesar eventos de clientes autenticados
            this.handleClientEvent(connectionId, parsedMessage.data);
          } else {
            this.sendToClient(connectionId, {
              type: 'error',
              error: 'AUTHENTICATION_REQUIRED',
              message: 'Debe autenticarse para enviar eventos'
            });
          }
          break;
          
        default:
          console.warn(`[WebSocket] Tipo de mensaje desconocido: ${parsedMessage.type}`);
      }
    } catch (error) {
      console.error(`[WebSocket] Error procesando mensaje de ${connectionId}:`, error);
      
      // Enviar error al cliente
      this.sendToClient(connectionId, {
        type: 'error',
        error: 'MESSAGE_PROCESSING_ERROR',
        message: 'Error al procesar el mensaje'
      });
    }
  }
  
  /**
   * Autentica un cliente con un token JWT
   * @param connectionId ID de la conexión
   * @param token Token JWT
   */
  private authenticateClient(connectionId: string, token: string): void {
    try {
      const client = this.clients.get(connectionId);
      if (!client) return;
      
      // Verificar el token
      const jwtSecret = process.env.JWT_SECRET || 'development-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      if (!decoded.user || !decoded.user.userId) {
        throw new Error('Token inválido o mal formado');
      }
      
      // Actualizar información del cliente
      client.userId = decoded.user.userId;
      client.deviceId = decoded.deviceId || `device-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`[WebSocket] Cliente ${connectionId} autenticado como usuario ${client.userId}`);
      
      // Notificar al cliente
      this.sendToClient(connectionId, {
        type: 'auth',
        status: 'authenticated',
        userId: client.userId
      });
      
      // Notificar al servicio de mensajería que hay un nuevo cliente conectado
      messagingService.publishEvent(
        EventType.USER_LOGIN,
        {
          userId: client.userId,
          deviceId: client.deviceId,
          connectionId
        }
      );
    } catch (error) {
      console.error(`[WebSocket] Error autenticando cliente ${connectionId}:`, error);
      
      // Enviar error al cliente
      this.sendToClient(connectionId, {
        type: 'auth',
        status: 'failed',
        error: 'AUTHENTICATION_FAILED',
        message: 'Token inválido o expirado'
      });
    }
  }
  
  /**
   * Maneja un evento enviado por un cliente
   * @param connectionId ID de la conexión
   * @param eventData Datos del evento
   */
  private handleClientEvent(connectionId: string, eventData: any): void {
    const client = this.clients.get(connectionId);
    if (!client || !client.userId) return;
    
    try {
      // Validar el evento
      if (!eventData.type) {
        throw new Error('Tipo de evento no especificado');
      }
      
      console.log(`[WebSocket] Evento recibido de cliente ${connectionId}: ${eventData.type}`);
      
      // Publicar el evento en RabbitMQ
      messagingService.publishEvent(
        eventData.type,
        eventData.data || {},
        {
          userId: client.userId,
          deviceId: client.deviceId
        }
      );
      
      // Confirmar recepción del evento
      this.sendToClient(connectionId, {
        type: 'event_ack',
        eventType: eventData.type,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`[WebSocket] Error procesando evento de cliente ${connectionId}:`, error);
      
      // Notificar error al cliente
      this.sendToClient(connectionId, {
        type: 'error',
        error: 'EVENT_PROCESSING_ERROR',
        message: 'Error al procesar el evento'
      });
    }
  }
  
  /**
   * Maneja el cierre de una conexión WebSocket
   * @param connectionId ID de la conexión
   */
  private handleClose(connectionId: string): void {
    const client = this.clients.get(connectionId);
    if (!client) return;
    
    console.log(`[WebSocket] Conexión cerrada: ${connectionId}`);
    
    // Si el cliente estaba autenticado, notificar al servicio de mensajería
    if (client.userId) {
      messagingService.publishEvent(
        EventType.USER_LOGOUT,
        {
          userId: client.userId,
          deviceId: client.deviceId,
          connectionId
        }
      );
    }
    
    // Eliminar la conexión
    this.clients.delete(connectionId);
  }
  
  /**
   * Envía un mensaje a un cliente específico
   * @param connectionId ID de la conexión
   * @param data Datos a enviar
   */
  private sendToClient(connectionId: string, data: any): void {
    const client = this.clients.get(connectionId);
    if (!client) return;
    
    try {
      const message = JSON.stringify(data);
      client.socket.send(message);
    } catch (error) {
      console.error(`[WebSocket] Error enviando mensaje a cliente ${connectionId}:`, error);
      
      // Si hay un error al enviar, la conexión podría estar rota
      this.clients.delete(connectionId);
    }
  }
  
  /**
   * Envía un mensaje a todos los clientes conectados
   * @param data Datos a enviar
   * @param filter Función opcional para filtrar clientes
   */
  broadcastToAll(data: any, filter?: (client: any) => boolean): void {
    for (const [connectionId, client] of this.clients.entries()) {
      if (filter && !filter(client)) continue;
      
      this.sendToClient(connectionId, data);
    }
  }
  
  /**
   * Envía un mensaje a todos los clientes autenticados como un usuario específico
   * @param userId ID del usuario
   * @param data Datos a enviar
   */
  broadcastToUser(userId: string, data: any): void {
    this.broadcastToAll(data, (client) => client.userId === userId);
  }
  
  /**
   * Envía un ping a un cliente para mantener la conexión activa
   * @param connectionId ID de la conexión
   */
  private sendPing(connectionId: string): void {
    const client = this.clients.get(connectionId);
    if (!client) return;
    
    try {
      client.socket.ping();
    } catch (error) {
      console.error(`[WebSocket] Error enviando ping a cliente ${connectionId}:`, error);
      this.clients.delete(connectionId);
    }
  }
  
  /**
   * Inicia el heartbeat para mantener conexiones activas y eliminar conexiones inactivas
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 60000; // 1 minuto de inactividad
      
      for (const [connectionId, client] of this.clients.entries()) {
        // Verificar si la conexión ha estado inactiva
        if (now - client.lastActivity > timeout) {
          console.log(`[WebSocket] Cerrando conexión inactiva: ${connectionId}`);
          
          try {
            client.socket.close(1000, 'Conexión inactiva');
          } catch (error) {
            // Ignorar errores, solo eliminar del mapa
          }
          
          this.clients.delete(connectionId);
        } else {
          // Enviar ping para mantener la conexión activa
          this.sendPing(connectionId);
        }
      }
      
      // Loggear estadísticas
      console.log(`[WebSocket] Conexiones activas: ${this.clients.size}`);
    }, 30000); // Verificar cada 30 segundos
  }
  
  /**
   * Detiene el servicio WebSocket
   */
  stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    
    this.clients.clear();
    console.log('[WebSocket] Servidor WebSocket detenido');
  }
  
  /**
   * Procesa un evento del sistema para enviarlo a clientes interesados
   * @param event Evento a procesar
   */
  processSystemEvent(event: Event): void {
    // Implementar lógica para determinar qué clientes deben recibir el evento
    // según el tipo de evento y los datos
    
    console.log(`[WebSocket] Procesando evento del sistema: ${event.type}`);
    
    switch (event.type) {
      case EventType.NOTIFICATION_CREATED:
        // Enviar notificación al usuario destinatario
        if (event.payload.userId) {
          this.broadcastToUser(event.payload.userId, {
            type: 'notification',
            data: event.payload
          });
        }
        break;
        
      case EventType.MAP_UPDATED:
        // Notificar a todos los usuarios que están viendo el mapa
        // En un sistema real, mantendrías un seguimiento de qué usuarios
        // están viendo qué mapas
        if (event.payload.mapId) {
          // Ejemplo: enviar a todos los usuarios (simplificado)
          this.broadcastToAll({
            type: 'map_update',
            data: event.payload
          });
        }
        break;
        
      // Otros tipos de eventos...
      
      default:
        // Ignorar eventos no relevantes para WebSockets
        break;
    }
  }
}

// Exportar instancia única (Singleton)
export default new WebSocketController(); 