/**
 * @fileoverview Definiciones de tipos para el sistema de mensajería RabbitMQ
 * 
 * Este archivo contiene todas las interfaces, tipos y enumeraciones
 * necesarias para trabajar con RabbitMQ en el sistema.
 * 
 * @module RabbitMQTypes
 */

import * as amqplib from 'amqplib';

/**
 * Enumeración de todos los tipos de eventos del sistema
 * Categorizado por dominio (usuario, mapa, notificación, etc.)
 * 
 * @enum {string}
 */
export enum TipoEvento {
  // Eventos de usuario
  USUARIO_CREADO = 'usuario.creado',
  USUARIO_ACTUALIZADO = 'usuario.actualizado',
  USUARIO_ELIMINADO = 'usuario.eliminado',
  USUARIO_INICIADO_SESION = 'usuario.iniciado_sesion',
  USUARIO_CERRADO_SESION = 'usuario.cerrado_sesion',
  USUARIO_PERFIL_ACTUALIZADO = 'usuario.perfil_actualizado',
  USUARIO_CAMBIO_PASSWORD = 'usuario.cambio_password',
  USUARIO_PREMIUM_ACTIVADO = 'usuario.premium_activado',
  USUARIO_PREMIUM_DESACTIVADO = 'usuario.premium_desactivado',
  
  // Eventos de mapa
  MAPA_CREADO = 'mapa.creado',
  MAPA_ACTUALIZADO = 'mapa.actualizado',
  MAPA_ELIMINADO = 'mapa.eliminado',
  MAPA_VISUALIZADO = 'mapa.visualizado',
  MAPA_COMPARTIDO = 'mapa.compartido',
  MAPA_PUNTO_AGREGADO = 'mapa.punto_agregado',
  MAPA_PUNTO_ACTUALIZADO = 'mapa.punto_actualizado',
  MAPA_PUNTO_ELIMINADO = 'mapa.punto_eliminado',
  MAPA_RUTA_AGREGADA = 'mapa.ruta_agregada',
  MAPA_RUTA_ACTUALIZADA = 'mapa.ruta_actualizada',
  MAPA_RUTA_ELIMINADA = 'mapa.ruta_eliminada',
  MAPA_ZONA_AGREGADA = 'mapa.zona_agregada',
  MAPA_ZONA_ACTUALIZADA = 'mapa.zona_actualizada',
  MAPA_ZONA_ELIMINADA = 'mapa.zona_eliminada',
  
  // Eventos de notificación
  NOTIFICACION_CREADA = 'notificacion.creada',
  NOTIFICACION_LEIDA = 'notificacion.leida',
  NOTIFICACION_ELIMINADA = 'notificacion.eliminada',
  NOTIFICACION_ENVIADA = 'notificacion.enviada',
  
  // Eventos sociales
  SOCIAL_COMENTARIO_CREADO = 'social.comentario.creado',
  SOCIAL_COMENTARIO_ACTUALIZADO = 'social.comentario.actualizado',
  SOCIAL_COMENTARIO_ELIMINADO = 'social.comentario.eliminado',
  SOCIAL_ME_GUSTA_CREADO = 'social.me_gusta.creado',
  SOCIAL_ME_GUSTA_ELIMINADO = 'social.me_gusta.eliminado',
  SOCIAL_COMPARTIR_CREADO = 'social.compartir.creado',
  SOCIAL_SEGUIR_USUARIO = 'social.seguir_usuario',
  SOCIAL_DEJAR_SEGUIR_USUARIO = 'social.dejar_seguir_usuario',
  
  // Eventos de dispositivos y ubicación
  UBICACION_ACTUALIZADA = 'ubicacion.actualizada',
  DISPOSITIVO_CONECTADO = 'dispositivo.conectado',
  DISPOSITIVO_DESCONECTADO = 'dispositivo.desconectado',
  
  // Eventos del sistema
  SISTEMA_ERROR = 'sistema.error',
  SISTEMA_ADVERTENCIA = 'sistema.advertencia',
  SISTEMA_INFO = 'sistema.info',
  SISTEMA_METRICAS = 'sistema.metricas',
  SISTEMA_SALUD = 'sistema.salud',
  SISTEMA_AUDITORIA = 'sistema.auditoria',

  // Eventos de error
  ERROR_MENSAJE = 'error.mensaje',
  ERROR_PROCESAMIENTO = 'error.procesamiento',
  ERROR_CONEXION = 'error.conexion',
  ERROR_TIMEOUT = 'error.timeout'
}

/**
 * Interfaz base para datos de eventos
 * 
 * @interface DatosEvento
 */
export interface DatosEvento {
  [key: string]: any;
}

/**
 * Datos de eventos relacionados con usuarios
 * 
 * @interface DatosEventoUsuario
 * @extends {DatosEvento}
 */
export interface DatosEventoUsuario extends DatosEvento {
  idUsuario: string;
  email?: string;
  nombreCompleto?: string;
  fechaEvento: string | Date;
}

/**
 * Datos de eventos relacionados con mapas
 * 
 * @interface DatosEventoMapa
 * @extends {DatosEvento}
 */
export interface DatosEventoMapa extends DatosEvento {
  idMapa: string;
  idUsuario: string;
  titulo?: string;
  isPublico?: boolean;
  fechaEvento: string | Date;
}

/**
 * Datos de eventos relacionados con notificaciones
 * 
 * @interface DatosEventoNotificacion
 * @extends {DatosEvento}
 */
export interface DatosEventoNotificacion extends DatosEvento {
  idNotificacion: string;
  idUsuarioDestinatario: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  datos?: any;
  fechaEvento: string | Date;
}

/**
 * Datos de eventos relacionados con interacciones sociales
 * 
 * @interface DatosEventoSocial
 * @extends {DatosEvento}
 */
export interface DatosEventoSocial extends DatosEvento {
  idContenido: string;
  idUsuario: string;
  tipoContenido: string;
  fechaEvento: string | Date;
}

/**
 * Datos de eventos relacionados con ubicación
 * 
 * @interface DatosEventoUbicacion
 * @extends {DatosEvento}
 */
export interface DatosEventoUbicacion extends DatosEvento {
  idUsuario: string;
  idDispositivo: string;
  latitud: number;
  longitud: number;
  precision?: number;
  altitud?: number;
  velocidad?: number;
  direccion?: number;
  fechaEvento: string | Date;
}

/**
 * Datos de eventos relacionados con el sistema
 * 
 * @interface DatosEventoSistema
 * @extends {DatosEvento}
 */
export interface DatosEventoSistema extends DatosEvento {
  idServicio: string;
  tipo: string;
  mensaje: string;
  detalles?: any;
  nivel: 'info' | 'warning' | 'error' | 'debug';
  fechaEvento: string | Date;
}

/**
 * Datos de eventos relacionados con errores en la mensajería
 * 
 * @interface DatosEventoError
 * @extends {DatosEvento}
 */
export interface DatosEventoError extends DatosEvento {
  tipoError: string;
  mensaje: string;
  codigoError?: string | number;
  fechaError: string | Date;
  eventoOriginal?: {
    tipo: string;
    datos: any;
  };
  intentos?: number;
  stack?: string;
}

/**
 * Estructura de un mensaje de evento
 * 
 * @interface MensajeEvento
 */
export interface MensajeEvento {
  tipo: string | TipoEvento;
  datos: any;
  metadatos: {
    timestamp: number;
    idUsuario?: string;
    idDispositivo?: string;
    idCorrelacion?: string;
    servicioOrigen: string;
  };
}

/**
 * Opciones para la publicación de mensajes
 * 
 * @interface OpcionesPublicacion
 */
export interface OpcionesPublicacion {
  persistente?: boolean;
  expiracion?: number;
  prioridad?: number;
  idCorrelacion?: string;
  headers?: Record<string, any>;
}

/**
 * Opciones para la suscripción a colas
 * 
 * @interface OpcionesSuscripcion
 */
export interface OpcionesSuscripcion {
  /** Define si la cola es durable (sobrevive reinicios) */
  durable?: boolean;
  /** Número de mensajes a prefetch */
  prefetch?: number;
  /** Si los mensajes se confirman automáticamente */
  autoAck?: boolean;
  /** Si se reencolan mensajes fallidos */
  requeue?: boolean;
  /** Máximo de reintentos antes de ir a DLQ */
  maxReintentos?: number;
  /** Tiempo de espera entre reintentos */
  tiempoEspera?: number;
}

/**
 * Función de callback para procesar mensajes
 * 
 * @callback CallbackMensaje
 * @param {any} mensaje - Contenido del mensaje
 * @param {any} metadatos - Metadatos del mensaje (puede ser el objeto de mensaje completo o solo la clave de enrutamiento)
 * @returns {Promise<void>|void} - Puede ser asíncrono o síncrono
 */
export type CallbackMensaje = (mensaje: any, metadatos: any) => Promise<void> | void;

/**
 * Tipo de función callback para procesar mensajes de error
 * 
 * @callback CallbackError
 * @param {MensajeEvento} mensaje - El mensaje de error
 * @param {Error} error - El error ocurrido
 * @returns {Promise<void> | void}
 */
export type CallbackError = (mensaje: MensajeEvento, error: Error) => Promise<void> | void;

/**
 * Interfaz de eventos emitidos por el conector RabbitMQ
 * 
 * @interface EventosConectorRabbitMQ
 */
export interface EventosConectorRabbitMQ {
  conectado: () => void;
  desconectado: () => void;
  error: (error: Error) => void;
  iniciado: () => void;
  reconectando: (intentos: number, retraso: number) => void;
  reconexionFallida: () => void;
  suscripcionRestaurada: (nombreCola: string) => void;
  eventoPublicado: (tipo: string | TipoEvento, mensaje: MensajeEvento) => void;
  bufferLleno: (tipo: string | TipoEvento) => void;
  errorPublicacion: (tipo: string | TipoEvento, error: Error) => void;
  mensajeRecibido: (claveEnrutamiento: string, contenido: MensajeEvento) => void;
  errorProcesamiento: (error: Error) => void;
  mensajeDescartado: (mensaje: amqplib.ConsumeMessage) => void;
  suscripcionEstablecida: (cola: string, clavesEnrutamiento: string[]) => void;
  errorSuscripcion: (error: Error) => void;
  errorNoCapturado: (error: Error) => void;
  detenido: () => void;
  errorAlDetener: (error: Error) => void;
  // Nuevos eventos para DLQ
  mensajeEnviadoADLQ: (mensaje: MensajeEvento, razon: string, intentos: number) => void;
  mensajeProcesadoDeDLQ: (mensaje: MensajeEvento, intentos: number) => void;
  procesandoDLQ: (nombreCola: string, cantidadMensajes: number) => void;
}

/**
 * Estado del conector RabbitMQ
 * 
 * @enum {string}
 */
export enum EstadoConector {
  DESCONECTADO = 'desconectado',
  CONECTANDO = 'conectando',
  CONECTADO = 'conectado',
  RECONECTANDO = 'reconectando',
  ERROR = 'error',
  DETENIDO = 'detenido'
}

/**
 * Métricas del conector RabbitMQ
 * 
 * @interface MetricasRabbitMQ
 */
export interface MetricasRabbitMQ {
  enviados: Record<string, number>;
  recibidos: Record<string, number>;
  errores: Record<string, number>;
  intentosReconexion: number;
  tiempoUltimaReconexion?: number;
  mensajesEnDLQ?: Record<string, number>;
  estadoActual: EstadoConector;
}

/**
 * Declaración de tipos para amqplib
 * Extiende las interfaces básicas de amqplib para proporcionar
 * definiciones más precisas.
 */
declare module 'amqplib' {
  // Definición de ServerProperties para tipar correctamente
  interface ServerProperties {
    [key: string]: any;
  }

  // Redefine Connection con solo las propiedades necesarias
  interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  interface Channel {
    assertExchange(exchange: string, type: string, options?: any): Promise<any>;
    assertQueue(queue: string, options?: any): Promise<any>;
    bindQueue(queue: string, exchange: string, routingKey: string): Promise<any>;
    publish(exchange: string, routingKey: string, content: Buffer, options?: any): boolean;
    consume(queue: string, onMessage: (msg: amqplib.ConsumeMessage | null) => void, options?: any): Promise<any>;
    ack(message: amqplib.ConsumeMessage): void;
    nack(message: amqplib.ConsumeMessage, allUpTo?: boolean, requeue?: boolean): void;
    prefetch(count: number, global?: boolean): Promise<void>;
    close(): Promise<void>;
    checkQueue(queue: string): Promise<amqplib.Replies.AssertQueue>;
    deleteQueue(queue: string, options?: amqplib.Options.DeleteQueue): Promise<amqplib.Replies.DeleteQueue>;
    purgeQueue(queue: string): Promise<amqplib.Replies.PurgeQueue>;
    unbindQueue(queue: string, exchange: string, routingKey: string): Promise<void>;
  }
} 