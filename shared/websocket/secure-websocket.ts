/**
 * Módulo SecureWebSocket
 * Proporciona una implementación segura de WebSockets con autenticación JWT y cifrado
 */

import WebSocket, { Server as WebSocketServer } from 'ws';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { encryptAES, decryptAES, generateSHA256 } from '@shared/security/crypto';
import { DecodedToken, jwtConfig } from '@shared/config/jwt.config';

// Opciones para el servidor WebSocket seguro
export interface SecureWSOptions {
  path?: string;                   // Ruta para las conexiones WebSocket
  corsOrigin?: string | string[];  // Orígenes permitidos para CORS
  requireAuth?: boolean;           // Si se requiere autenticación con JWT
  useEncryption?: boolean;         // Si se debe cifrar la comunicación
}

// Socket autenticado con información de usuario
export interface AuthenticatedSocket extends WebSocket {
  id: string;                      // ID único del socket
  user?: DecodedToken;             // Información del usuario autenticado
  encryptionKey?: string;          // Clave de cifrado única para este socket
  room?: string;                   // Sala a la que pertenece el socket
  handshake?: {                    // Información de la conexión
    auth: Record<string, any>;     // Datos de autenticación
    headers: Record<string, any>;  // Cabeceras HTTP
  };
}

/**
 * Servidor WebSocket seguro con autenticación JWT y cifrado
 */
export class SecureWebSocketServer {
  private io: WebSocketServer;
  private options: SecureWSOptions;
  private connectedUsers: Map<string, WebSocket[]> = new Map();

  /**
   * Constructor del servidor WebSocket seguro
   * @param httpServer Servidor HTTP para montar el WebSocket
   * @param options Opciones de configuración
   */
  constructor(httpServer: HttpServer, options: SecureWSOptions = {}) {
    // Opciones por defecto
    this.options = {
      path: '/ws',
      corsOrigin: '*',
      requireAuth: true,
      useEncryption: true,
      ...options
    };

    // Crear servidor de WebSocket
    this.io = new WebSocketServer({
      server: httpServer,
      path: this.options.path
    });

    // Configurar middleware de autenticación si es requerido
    if (this.options.requireAuth) {
      this.setupAuthMiddleware();
    }

    // Configurar manejadores de conexión
    this.setupConnectionHandlers();
  }

  /**
   * Configura el middleware de autenticación JWT
   */
  private setupAuthMiddleware(): void {
    this.io.on('connection', (socket: WebSocket, request) => {
      // Obtener token de los parámetros de consulta o cabeceras
      const token = this.extractToken(request);
      
      if (!token) {
        socket.close(4001, 'Autenticación requerida');
        return;
      }

      try {
        // Verificar token JWT
        const decoded = jwt.verify(token, jwtConfig.secretKey) as DecodedToken;
        
        // Almacenar información de usuario en el socket
        (socket as any).user = decoded;
        (socket as any).id = this.generateSocketId();
      } catch (error) {
        socket.close(4002, 'Token inválido');
      }
    });
  }

  /**
   * Extrae el token de la solicitud
   */
  private extractToken(request: any): string | null {
    // Intentar obtener token de la cabecera de autorización
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    // Intentar obtener token de la URL
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    
    return token;
  }

  /**
   * Genera un ID único para el socket
   */
  private generateSocketId(): string {
    return `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Configura los manejadores de conexión y desconexión
   */
  private setupConnectionHandlers(): void {
    this.io.on('connection', (socket: WebSocket) => {
      const socketWithData = socket as any;
      console.log(`Cliente conectado: ${socketWithData.id || 'anónimo'}`);
      
      // Si se requiere cifrado, configurarlo para este socket
      if (this.options.useEncryption) {
        this.setupEncryption(socket);
      }
      
      // Almacenar conexión de usuario si está autenticado
      if (socketWithData.user?.userId) {
        const userId = socketWithData.user.userId;
        
        if (!this.connectedUsers.has(userId)) {
          this.connectedUsers.set(userId, []);
        }
        
        this.connectedUsers.get(userId)?.push(socket);
        
        // Emitir evento de conexión exitosa
        this.sendToSocket(socket, {
          event: 'connection:success',
          data: {
            userId: socketWithData.user.userId,
            socketId: socketWithData.id,
            encrypted: this.options.useEncryption
          }
        });
      }
      
      // Manejar desconexión
      socket.on('close', () => {
        console.log(`Cliente desconectado: ${socketWithData.id || 'anónimo'}`);
        
        // Eliminar socket de la lista de usuarios conectados
        if (socketWithData.user?.userId) {
          const userId = socketWithData.user.userId;
          const userSockets = this.connectedUsers.get(userId) || [];
          
          const updatedSockets = userSockets.filter(s => (s as any).id !== socketWithData.id);
          
          if (updatedSockets.length === 0) {
            this.connectedUsers.delete(userId);
          } else {
            this.connectedUsers.set(userId, updatedSockets);
          }
        }
      });

      // Manejar mensaje
      socket.on('message', (data: any) => {
        try {
          const parsedData = JSON.parse(data.toString());
          // Procesar mensaje
          this.processMessage(socket, parsedData);
        } catch (error) {
          console.error('Error al procesar mensaje:', error);
        }
      });
    });
  }

  /**
   * Procesa un mensaje recibido
   */
  private processMessage(socket: WebSocket, message: any): void {
    // Descifrar mensaje si es necesario
    if (message.encrypted && this.options.useEncryption) {
      try {
        const socketWithData = socket as any;
        if (socketWithData.encryptionKey) {
          const decryptedData = decryptAES(message.data);
          message = JSON.parse(decryptedData);
        }
      } catch (error) {
        console.error('Error al descifrar mensaje:', error);
        return;
      }
    }

    // Procesar eventos específicos
    if (message.event === 'ping') {
      this.sendToSocket(socket, { event: 'pong', data: { time: Date.now() } });
    }
  }

  /**
   * Envía un mensaje a un socket específico
   */
  private sendToSocket(socket: WebSocket, data: any): void {
    try {
      const socketWithData = socket as any;
      let messageData = JSON.stringify(data);
      
      // Cifrar mensaje si es necesario
      if (this.options.useEncryption && socketWithData.encryptionKey) {
        const encryptedData = encryptAES(messageData);
        messageData = JSON.stringify({
          encrypted: true,
          data: encryptedData
        });
      }
      
      socket.send(messageData);
    } catch (error) {
      console.error('Error al enviar mensaje a socket:', error);
    }
  }

  /**
   * Configura el cifrado para un socket específico
   * @param socket Socket a configurar con cifrado
   */
  private setupEncryption(socket: WebSocket): void {
    // Generar clave única de cifrado para este socket
    const socketSecret = generateSHA256(Date.now().toString() + Math.random().toString());
    const encryptionKey = socketSecret.substring(0, 32); // AES-256 requiere 32 bytes
    
    // Guardar clave en el socket
    (socket as any).encryptionKey = encryptionKey;
    
    // Enviar clave al cliente
    this.sendToSocket(socket, {
      event: 'encryption:key',
      data: { key: encryptionKey }
    });
  }

  /**
   * Envía un mensaje a todos los clientes conectados
   * @param event Nombre del evento
   * @param data Datos a enviar
   */
  public broadcast(event: string, data: any): void {
    this.io.clients.forEach((socket: WebSocket) => {
      this.sendToSocket(socket, {
        event: event,
        data: data
      });
    });
  }

  /**
   * Envía un mensaje a un usuario específico en todos sus dispositivos
   * @param userId ID del usuario
   * @param event Nombre del evento
   * @param data Datos a enviar
   * @returns true si se envió con éxito, false si el usuario no está conectado
   */
  public sendToUser(userId: string, event: string, data: any): boolean {
    const userSockets = this.connectedUsers.get(userId);
    
    if (!userSockets || userSockets.length === 0) {
      return false;
    }
    
    userSockets.forEach((socket: WebSocket) => {
      this.sendToSocket(socket, {
        event: event,
        data: data
      });
    });
    
    return true;
  }

  /**
   * Verifica si un usuario está actualmente conectado
   * @param userId ID del usuario a verificar
   * @returns true si el usuario está conectado, false en caso contrario
   */
  public isUserConnected(userId: string): boolean {
    const sockets = this.connectedUsers.get(userId);
    return !!sockets && sockets.length > 0;
  }

  /**
   * Obtiene el número de usuarios conectados
   * @returns Número de usuarios únicos conectados
   */
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }
  
  /**
   * Obtiene la instancia del servidor WebSocket
   * @returns Instancia del servidor
   */
  public getServer(): WebSocketServer {
    return this.io;
  }
} 