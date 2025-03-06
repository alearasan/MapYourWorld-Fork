/**
 * Servicio de mensajería para comunicación entre microservicios
 * Utiliza RabbitMQ para implementar patrones como event-driven architecture,
 * pub/sub, command pattern y message queuing
 */

import { TipoEvento, MensajeEvento, publicarEvento, suscribirseEventos } from '../models/rabbit-mq';
import ConectorRabbitMQ from '../models/rabbit-mq/rabbit-mq';
import { getMetricsStore } from '../middleware/metrics';

// Tipos de eventos del sistema
export enum EventType {
  // Eventos de usuario
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  
  // Eventos de mapa
  MAP_CREATED = 'map.created',
  MAP_UPDATED = 'map.updated',
  MAP_DELETED = 'map.deleted',
  MAP_VIEWED = 'map.viewed',
  MAP_SHARED = 'map.shared',
  
  // Eventos de notificación
  NOTIFICATION_CREATED = 'notification.created',
  NOTIFICATION_READ = 'notification.read',
  NOTIFICATION_DELETED = 'notification.deleted',
  
  // Eventos sociales
  SOCIAL_COMMENT_CREATED = 'social.comment.created',
  SOCIAL_LIKE_CREATED = 'social.like.created',
  SOCIAL_SHARE_CREATED = 'social.share.created',
  
  // Eventos del sistema
  SYSTEM_ERROR = 'system.error',
  SYSTEM_WARNING = 'system.warning',
  SYSTEM_INFO = 'system.info'
}

// Interfaz para eventos con metadatos
export interface Event {
  type: EventType | string;
  payload: any;
  metadata: {
    timestamp: number;
    userId?: string;
    deviceId?: string;
    correlationId?: string;
    sourceService: string;
  };
}

/**
 * Clase para gestionar la comunicación basada en eventos entre servicios
 * Implementa el patrón Singleton para asegurar una única instancia
 */
class MessagingService {
  private static instance: MessagingService;
  private initialized: boolean = false;
  
  private constructor() {}
  
  /**
   * Obtiene la instancia única del servicio (Singleton)
   */
  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }
  
  /**
   * Inicializa el servicio suscribiéndose a los eventos relevantes
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Suscribirse a eventos de otros servicios
      await this.setupSubscriptions();
      
      this.initialized = true;
      console.log('[MessagingService] Servicio de mensajería inicializado correctamente');
    } catch (error) {
      console.error('[MessagingService] Error al inicializar el servicio de mensajería:', error);
      throw error;
    }
  }
  
  /**
   * Configura las suscripciones a eventos de distintos microservicios
   */
  private async setupSubscriptions(): Promise<void> {
    // Suscripción a eventos de usuario
    await suscribirseEventos(
      'api-gateway-user-events',
      ['user.*'],  // Array de patrones de enrutamiento
      this.handleUserEvent.bind(this),
      'api-gateway'
    );
    
    // Suscripción a eventos de mapas
    await suscribirseEventos(
      'api-gateway-map-events',
      ['map.*'],  // Array de patrones de enrutamiento
      this.handleMapEvent.bind(this),
      'api-gateway'
    );
    
    // Suscripción a eventos de notificaciones
    await suscribirseEventos(
      'api-gateway-notification-events',
      ['notification.*'],  // Array de patrones de enrutamiento
      this.handleNotificationEvent.bind(this),
      'api-gateway'
    );
    
    // Suscripción a eventos sociales
    await suscribirseEventos(
      'api-gateway-social-events',
      ['social.*'],  // Array de patrones de enrutamiento
      this.handleSocialEvent.bind(this),
      'api-gateway'
    );
    
    // Suscripción a eventos del sistema
    await suscribirseEventos(
      'api-gateway-system-events',
      ['system.*'],  // Array de patrones de enrutamiento
      this.handleSystemEvent.bind(this),
      'api-gateway'
    );
  }
  
  /**
   * Publica un evento en el sistema de mensajería
   * @param eventType Tipo de evento
   * @param payload Datos del evento
   * @param metadata Metadatos adicionales (opcional)
   */
  public async publishEvent(
    eventType: EventType | string,
    payload: any,
    metadata: Partial<Event['metadata']> = {}
  ): Promise<void> {
    const eventData: Event = {
      type: eventType,
      payload,
      metadata: {
        timestamp: Date.now(),
        sourceService: 'api-gateway',
        ...metadata
      }
    };
    
    try {
      await publicarEvento(
        eventType,             // tipo de evento
        payload,               // datos del evento
        'api-gateway',         // nombre del servicio
        {                      // opciones opcionales
          idCorrelacion: metadata.correlationId
        }
      );
      
      console.log(`[MessagingService] Evento publicado: ${eventType}`);
      
      // Registrar métrica del evento
      const metricsStore = getMetricsStore();
      if (metricsStore) {
        metricsStore.registerServiceMetric('messaging', 0, true);
      }
    } catch (error) {
      console.error(`[MessagingService] Error al publicar evento ${eventType}:`, error);
      
      // Registrar error en métricas
      const metricsStore = getMetricsStore();
      if (metricsStore) {
        metricsStore.registerServiceMetric('messaging', 0, false);
        metricsStore.registerError('MessagingError', `Error publicando evento: ${eventType}`);
      }
      
      throw error;
    }
  }
  
  /**
   * Manejador de eventos de usuario
   */
  private async handleUserEvent(event: MensajeEvento, routingKey: string): Promise<void> {
    console.log(`[MessagingService] Evento de usuario recibido: ${routingKey}`, event);
    
    // Aquí se implementa la lógica específica para cada tipo de evento de usuario
    if (routingKey === EventType.USER_CREATED) {
      // Lógica para manejar la creación de usuario
      // Por ejemplo, actualizar caché, notificar a otros servicios, etc.
    } else if (routingKey === EventType.USER_LOGIN) {
      // Lógica para manejar login de usuario
    }
    
    // También podríamos emitir el evento a los clientes conectados vía WebSockets
  }
  
  /**
   * Manejador de eventos de mapa
   */
  private async handleMapEvent(event: MensajeEvento, routingKey: string): Promise<void> {
    console.log(`[MessagingService] Evento de mapa recibido: ${routingKey}`, event);
    
    // Lógica específica para eventos de mapas
  }
  
  /**
   * Manejador de eventos de notificación
   */
  private async handleNotificationEvent(event: MensajeEvento, routingKey: string): Promise<void> {
    console.log(`[MessagingService] Evento de notificación recibido: ${routingKey}`, event);
    
    // Lógica específica para eventos de notificaciones
  }
  
  /**
   * Manejador de eventos sociales
   */
  private async handleSocialEvent(event: MensajeEvento, routingKey: string): Promise<void> {
    console.log(`[MessagingService] Evento social recibido: ${routingKey}`, event);
    
    // Lógica específica para eventos sociales
  }
  
  /**
   * Manejador de eventos del sistema
   */
  private async handleSystemEvent(event: MensajeEvento, routingKey: string): Promise<void> {
    console.log(`[MessagingService] Evento del sistema recibido: ${routingKey}`, event);
    
    // Lógica específica para eventos del sistema
    // Por ejemplo, registrar errores, alertas, etc.
  }
}

// Exportar la instancia única
export default MessagingService.getInstance(); 