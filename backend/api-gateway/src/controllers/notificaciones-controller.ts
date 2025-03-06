/**
 * Controlador de notificaciones en tiempo real
 * 
 * Este controlador gestiona la comunicación en tiempo real
 * con los clientes a través de WebSockets, recibiendo eventos
 * de RabbitMQ y enviándolos a los clientes conectados.
 */

import { Server } from 'http';
import WebSocket from 'ws';
// Importar desde el archivo barril
import { 
  inicializarRabbitMQ, 
  suscribirseTodosEventos,
  MensajeEvento,
  TipoEvento
} from '../models/rabbit-mq';

// Nombre del servicio para RabbitMQ
const NOMBRE_SERVICIO = 'api-gateway';

// Interfaz para cliente WebSocket con datos adicionales
interface ClienteWebSocket extends WebSocket {
  isAlive: boolean;
  idUsuario?: string;
  idSesion: string;
  suscripciones: Set<string>;
}

// Clase para gestionar las notificaciones en tiempo real
class NotificacionesController {
  private wss: WebSocket.Server | null = null;
  private clientes: Map<string, ClienteWebSocket> = new Map();
  private intervaloPing: NodeJS.Timeout | null = null;
  private iniciado: boolean = false;

  /**
   * Inicializa el controlador de notificaciones
   * @param server Servidor HTTP para adjuntar el WebSocket
   */
  public async iniciar(server: Server): Promise<void> {
    if (this.iniciado) return;

    try {
      // Inicializar WebSocket server
      this.wss = new WebSocket.Server({ server });
      
      // Configurar eventos de WebSocket
      this.configurarEventosWebSocket();
      
      // Iniciar ping periódico para mantener conexiones activas
      this.iniciarPing();
      
      // Inicializar RabbitMQ y suscribirse a eventos
      await this.iniciarRabbitMQ();
      
      this.iniciado = true;
      console.log('[NotificacionesController] Inicializado correctamente');
    } catch (error) {
      console.error('[NotificacionesController] Error al inicializar:', error);
      throw error;
    }
  }

  /**
   * Configura los eventos del servidor WebSocket
   */
  private configurarEventosWebSocket(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket, req) => {
      // Crear ID de sesión único para este cliente
      const idSesion = `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      // Configurar cliente con datos adicionales
      const cliente = ws as ClienteWebSocket;
      cliente.isAlive = true;
      cliente.idSesion = idSesion;
      cliente.suscripciones = new Set();
      
      // Guardar referencia al cliente
      this.clientes.set(idSesion, cliente);
      
      console.log(`[NotificacionesController] Nuevo cliente conectado: ${idSesion}`);
      
      // Configurar eventos del cliente
      cliente.on('message', (mensaje) => this.procesarMensaje(cliente, mensaje));
      
      cliente.on('close', () => {
        console.log(`[NotificacionesController] Cliente desconectado: ${idSesion}`);
        this.clientes.delete(idSesion);
      });
      
      cliente.on('error', (error) => {
        console.error(`[NotificacionesController] Error en cliente ${idSesion}:`, error);
        try {
          cliente.terminate();
        } catch (err) {
          console.error('[NotificacionesController] Error al terminar cliente:', err);
        }
        this.clientes.delete(idSesion);
      });
      
      cliente.on('pong', () => {
        cliente.isAlive = true;
      });
      
      // Enviar mensaje de bienvenida
      this.enviarMensajeACliente(cliente, {
        tipo: 'sistema.conectado',
        datos: {
          mensaje: 'Conectado al servidor de notificaciones',
          timestamp: Date.now(),
          idSesion
        }
      });
    });

    this.wss.on('error', (error) => {
      console.error('[NotificacionesController] Error en servidor WebSocket:', error);
    });
  }

  /**
   * Inicia un ping periódico para mantener las conexiones activas
   */
  private iniciarPing(): void {
    if (this.intervaloPing) {
      clearInterval(this.intervaloPing);
    }
    
    this.intervaloPing = setInterval(() => {
      if (!this.wss) return;
      
      this.clientes.forEach((cliente, id) => {
        if (cliente.isAlive === false) {
          console.log(`[NotificacionesController] Cliente ${id} no responde, terminando conexión`);
          cliente.terminate();
          this.clientes.delete(id);
          return;
        }
        
        cliente.isAlive = false;
        try {
          cliente.ping();
        } catch (error) {
          console.error(`[NotificacionesController] Error al enviar ping a ${id}:`, error);
          cliente.terminate();
          this.clientes.delete(id);
        }
      });
    }, 30000); // cada 30 segundos
  }

  /**
   * Inicializa la conexión con RabbitMQ y se suscribe a eventos
   */
  private async iniciarRabbitMQ(): Promise<void> {
    try {
      // Inicializar RabbitMQ
      await inicializarRabbitMQ(NOMBRE_SERVICIO);
      
      // Suscribirse a todos los eventos
      await suscribirseTodosEventos(
        NOMBRE_SERVICIO,
        'api-gateway_eventos_notificaciones',
        this.procesarEventoRabbitMQ.bind(this)
      );
      
      console.log('[NotificacionesController] Conectado a RabbitMQ y suscrito a eventos');
    } catch (error) {
      console.error('[NotificacionesController] Error al conectar con RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Procesa un mensaje WebSocket enviado por un cliente
   * @param cliente Cliente que envió el mensaje
   * @param mensaje Mensaje recibido
   */
  private procesarMensaje(cliente: ClienteWebSocket, mensaje: WebSocket.Data): void {
    try {
      // Convertir el mensaje a objeto
      const datos = JSON.parse(mensaje.toString());
      
      console.log(`[NotificacionesController] Mensaje de cliente ${cliente.idSesion}:`, datos.tipo);
      
      // Procesar según el tipo de mensaje
      switch (datos.tipo) {
        case 'autenticar':
          this.autenticarCliente(cliente, datos.idUsuario, datos.token);
          break;
          
        case 'suscribirse':
          this.suscribirCliente(cliente, datos.canales || []);
          break;
          
        case 'desuscribirse':
          this.desuscribirCliente(cliente, datos.canales || []);
          break;
          
        default:
          console.warn(`[NotificacionesController] Tipo de mensaje no reconocido: ${datos.tipo}`);
      }
    } catch (error) {
      console.error(`[NotificacionesController] Error al procesar mensaje de ${cliente.idSesion}:`, error);
      this.enviarMensajeACliente(cliente, {
        tipo: 'sistema.error',
        datos: {
          mensaje: 'Error al procesar mensaje',
          error: (error as Error).message
        }
      });
    }
  }

  /**
   * Autentica a un cliente con su ID de usuario
   * @param cliente Cliente a autenticar
   * @param idUsuario ID del usuario
   * @param token Token de autenticación (opcional)
   */
  private autenticarCliente(cliente: ClienteWebSocket, idUsuario: string, token?: string): void {
    // Aquí podría verificarse el token contra el servicio de autenticación
    // Por ahora simplemente asignamos el ID de usuario
    
    cliente.idUsuario = idUsuario;
    console.log(`[NotificacionesController] Cliente ${cliente.idSesion} autenticado como usuario ${idUsuario}`);
    
    this.enviarMensajeACliente(cliente, {
      tipo: 'sistema.autenticado',
      datos: {
        idUsuario,
        idSesion: cliente.idSesion,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Suscribe a un cliente a canales específicos
   * @param cliente Cliente a suscribir
   * @param canales Canales a los que suscribirse
   */
  private suscribirCliente(cliente: ClienteWebSocket, canales: string[]): void {
    if (!canales || !canales.length) return;
    
    canales.forEach(canal => {
      cliente.suscripciones.add(canal);
    });
    
    console.log(`[NotificacionesController] Cliente ${cliente.idSesion} suscrito a: ${canales.join(', ')}`);
    
    this.enviarMensajeACliente(cliente, {
      tipo: 'sistema.suscrito',
      datos: {
        canales,
        total: cliente.suscripciones.size
      }
    });
  }

  /**
   * Desuscribe a un cliente de canales específicos
   * @param cliente Cliente a desuscribir
   * @param canales Canales de los que desuscribirse
   */
  private desuscribirCliente(cliente: ClienteWebSocket, canales: string[]): void {
    if (!canales || !canales.length) return;
    
    canales.forEach(canal => {
      cliente.suscripciones.delete(canal);
    });
    
    console.log(`[NotificacionesController] Cliente ${cliente.idSesion} desuscrito de: ${canales.join(', ')}`);
    
    this.enviarMensajeACliente(cliente, {
      tipo: 'sistema.desuscrito',
      datos: {
        canales,
        total: cliente.suscripciones.size
      }
    });
  }

  /**
   * Procesa un evento recibido de RabbitMQ
   * @param mensaje Mensaje del evento
   * @param claveEnrutamiento Clave de enrutamiento
   */
  private procesarEventoRabbitMQ(mensaje: MensajeEvento, claveEnrutamiento: string): void {
    try {
      console.log(`[NotificacionesController] Evento recibido: ${claveEnrutamiento}`);
      
      // Enviar el evento a los clientes interesados
      this.enviarEventoAClientesInteresados(mensaje, claveEnrutamiento);
    } catch (error) {
      console.error('[NotificacionesController] Error al procesar evento RabbitMQ:', error);
    }
  }

  /**
   * Envía un evento a los clientes que están interesados en él
   * @param mensaje Mensaje del evento
   * @param claveEnrutamiento Clave de enrutamiento
   */
  private enviarEventoAClientesInteresados(mensaje: MensajeEvento, claveEnrutamiento: string): void {
    // Obtener categoría del evento (ej: 'usuario' de 'usuario.creado')
    const categoria = claveEnrutamiento.split('.')[0];
    
    // Obtener ID de usuario del evento si existe
    const idUsuario = mensaje.metadatos.idUsuario;
    
    this.clientes.forEach(cliente => {
      // Determinar si el cliente debe recibir el evento
      const debeRecibir = this.clienteDebeRecibirEvento(cliente, claveEnrutamiento, categoria, idUsuario);
      
      if (debeRecibir) {
        this.enviarMensajeACliente(cliente, {
          tipo: claveEnrutamiento,
          datos: mensaje.datos,
          metadatos: {
            timestamp: mensaje.metadatos.timestamp,
            idCorrelacion: mensaje.metadatos.idCorrelacion
          }
        });
      }
    });
  }

  /**
   * Determina si un cliente debe recibir un evento específico
   * @param cliente Cliente a verificar
   * @param claveEnrutamiento Clave de enrutamiento del evento
   * @param categoria Categoría del evento
   * @param idUsuario ID de usuario relacionado con el evento
   * @returns true si el cliente debe recibir el evento
   */
  private clienteDebeRecibirEvento(
    cliente: ClienteWebSocket,
    claveEnrutamiento: string,
    categoria: string,
    idUsuario?: string
  ): boolean {
    // Si el cliente no está autenticado, solo enviar eventos de sistema
    if (!cliente.idUsuario && categoria !== 'sistema') {
      return false;
    }
    
    // Si el cliente está suscrito a todos los eventos
    if (cliente.suscripciones.has('#')) {
      return true;
    }
    
    // Si el cliente está suscrito a la clave de enrutamiento exacta
    if (cliente.suscripciones.has(claveEnrutamiento)) {
      return true;
    }
    
    // Si el cliente está suscrito a todos los eventos de esta categoría
    if (cliente.suscripciones.has(`${categoria}.*`)) {
      return true;
    }
    
    // Si el evento es específico para este usuario
    if (idUsuario && cliente.idUsuario === idUsuario) {
      // Eventos específicos de usuario siempre se envían a ese usuario
      return true;
    }
    
    // El cliente no está interesado en este evento
    return false;
  }

  /**
   * Envía un mensaje a un cliente
   * @param cliente Cliente al que enviar el mensaje
   * @param datos Datos a enviar
   */
  private enviarMensajeACliente(cliente: ClienteWebSocket, datos: any): void {
    try {
      if (cliente.readyState !== WebSocket.OPEN) {
        console.warn(`[NotificacionesController] Cliente ${cliente.idSesion} no está listo para recibir mensajes`);
        return;
      }
      
      cliente.send(JSON.stringify(datos));
    } catch (error) {
      console.error(`[NotificacionesController] Error al enviar mensaje a cliente ${cliente.idSesion}:`, error);
    }
  }

  /**
   * Detiene el controlador de notificaciones
   */
  public async detener(): Promise<void> {
    try {
      // Detener ping
      if (this.intervaloPing) {
        clearInterval(this.intervaloPing);
        this.intervaloPing = null;
      }
      
      // Cerrar todas las conexiones de clientes
      this.clientes.forEach(cliente => {
        try {
          cliente.close();
        } catch (err) {
          console.error('[NotificacionesController] Error al cerrar cliente:', err);
        }
      });
      
      this.clientes.clear();
      
      // Cerrar servidor WebSocket
      if (this.wss) {
        this.wss.close();
        this.wss = null;
      }
      
      this.iniciado = false;
      console.log('[NotificacionesController] Detenido correctamente');
    } catch (error) {
      console.error('[NotificacionesController] Error al detener:', error);
    }
  }
}

// Exportar singleton
export default new NotificacionesController(); 