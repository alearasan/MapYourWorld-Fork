/**
 * @fileoverview Módulo de RabbitMQ para API Gateway
 * 
 * Este módulo proporciona una interfaz unificada para conectarse y utilizar RabbitMQ
 * en la comunicación entre microservicios del sistema MapYourWorld.
 * 
 * @example
 * // Inicializar RabbitMQ para un servicio
 * import { inicializarRabbitMQ } from './models/rabbit-mq';
 * await inicializarRabbitMQ('nombre-servicio');
 * 
 * @example
 * // Publicar un evento
 * import { publicarEvento, TipoEvento } from './models/rabbit-mq';
 * await publicarEvento(
 *   'nombre-servicio',
 *   TipoEvento.USUARIO_CREADO,
 *   { id: '123', nombre: 'Usuario' }
 * );
 * 
 * @example
 * // Suscribirse a eventos específicos
 * import { suscribirseAEventos } from './models/rabbit-mq';
 * await suscribirseAEventos(
 *   'nombre-servicio',
 *   'nombre-cola',
 *   [TipoEvento.USUARIO_CREADO, TipoEvento.USUARIO_ACTUALIZADO],
 *   async (mensaje, claveEnrutamiento) => {
 *     console.log(`Evento recibido: ${claveEnrutamiento}`, mensaje);
 *   }
 * );
 * 
 * @module RabbitMQ
 */

// Exportar desde el módulo unificado
export * from './rabbit-mq';
export { default } from './rabbit-mq';

// Exportar tipos
export * from './rabbit-mq.types';