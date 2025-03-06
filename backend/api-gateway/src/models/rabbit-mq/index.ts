/**
 * @fileoverview Módulo de RabbitMQ para API Gateway
 * 
 * Este módulo proporciona una interfaz unificada para conectarse y utilizar RabbitMQ
 * en la comunicación entre microservicios del sistema MapYourWorld.
 * Se incluye soporte para colas de mensajes fallidos, reintentos y mejor manejo de errores.
 * 
 * @example
 * // Inicializar RabbitMQ para un servicio
 * import { inicializarRabbitMQ } from './models/rabbit-mq';
 * await inicializarRabbitMQ('api-gateway');
 * 
 * @example
 * // Publicar un evento con opciones
 * import { publicarEvento, TipoEvento } from './models/rabbit-mq';
 * await publicarEvento(
 *   TipoEvento.USUARIO_CREADO,
 *   { id: '123', nombre: 'Usuario' },
 *   'api-gateway',
 *   { 
 *     persistente: true,
 *     prioridad: 5,
 *     expiracion: 30000 // 30 segundos
 *   }
 * );
 * 
 * @example
 * // Suscribirse a eventos específicos con manejo de reintentos
 * import { suscribirseEventos } from './models/rabbit-mq';
 * await suscribirseEventos(
 *   'usuarios',
 *   ['usuario.creado', 'usuario.actualizado'],
 *   async (mensaje, claveEnrutamiento) => {
 *     console.log(`Evento recibido: ${claveEnrutamiento}`, mensaje);
 *   },
 *   'api-gateway',
 *   {
 *     maxReintentos: 3,
 *     tiempoEspera: 5000 // 5 segundos entre reintentos
 *   }
 * );
 * 
 * @example
 * // Obtener métricas de RabbitMQ
 * import { obtenerMetricasRabbitMQ } from './models/rabbit-mq';
 * const metricas = obtenerMetricasRabbitMQ('api-gateway');
 * console.log('Métricas:', metricas);
 * 
 * @example
 * // Iniciar monitoreo de colas de mensajes fallidos
 * import { iniciarMonitoreoDLQ } from './models/rabbit-mq';
 * await iniciarMonitoreoDLQ({
 *   nombreServicio: 'api-gateway',
 *   intervaloMonitoreo: 60000, // cada minuto
 *   habilitarRepublicacion: true
 * });
 * 
 * @example
 * // Suscribirse a una categoría específica de eventos
 * import { suscribirseACategoria } from './models/rabbit-mq';
 * const idSuscripcion = await suscribirseACategoria(
 *   'usuarios',
 *   (mensaje) => {
 *     console.log('Evento de usuario recibido:', mensaje);
 *   }
 * );
 * 
 * @example
 * // Suscribirse a todos los eventos del sistema
 * import { suscribirseTodosEventos } from './models/rabbit-mq';
 * const idSuscripcion = await suscribirseTodosEventos(
 *   (mensaje) => {
 *     console.log('Evento recibido:', mensaje);
 *   }
 * );
 * 
 * @module RabbitMQ
 */

// Exportar todas las funciones y clases desde módulo rabbit-mq.ts
export * from './rabbit-mq';

// Exportar el enum de TipoEvento como valor
export { TipoEvento } from './rabbit-mq.types';

// Exportar explícitamente los tipos desde rabbit-mq.types.ts usando 'export type'
export type {
  MensajeEvento,
  DatosEvento,
  DatosEventoUsuario,
  DatosEventoMapa,
  DatosEventoNotificacion,
  DatosEventoSocial,
  DatosEventoUbicacion,
  DatosEventoSistema,
  DatosEventoError,
  OpcionesPublicacion,
  OpcionesSuscripcion,
  CallbackMensaje,
  CallbackError,
  EventosConectorRabbitMQ,
  EstadoConector,
  MetricasRabbitMQ
} from './rabbit-mq.types';

// Exportar procesador de colas de mensajes fallidos
export * from './dead-letter-processor';

// Exportar nuevas funciones desde la carpeta colasConfig
export { crearColasRequeridas } from '../../colasConfig/setup-crear-colas';
export { purgarColas } from '../../colasConfig/setup-limpiar-colas';