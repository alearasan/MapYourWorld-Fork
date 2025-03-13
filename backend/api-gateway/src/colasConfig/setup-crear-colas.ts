/**
 * Script para crear las colas requeridas en RabbitMQ
 * 
 * Ejecutar con: npx ts-node src/colasConfig/setup-crear-colas.ts
 */

import amqp from 'amqplib';

// Constantes de RabbitMQ
const RABBITMQ_EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'mapyourworld';
const RABBITMQ_DLX_EXCHANGE = `${RABBITMQ_EXCHANGE}.mensaje-fallido`;

// Nombres de colas que necesitamos crear si no existen
const COLAS_REQUERIDAS = [
  'mapyourworld_api-gateway_eventos_auth',
  'mapyourworld_api-gateway_eventos_mapas',
  'mapyourworld_api-gateway_eventos_notificaciones',
  'mapyourworld_api-gateway_eventos_sociales',
  'mapyourworld_api-gateway_eventos_usuarios',
  'mapyourworld_api-gateway_eventos_notificaciones'
];

// Configuración para las colas principales (no DLQ)
const COLA_CONFIG = {
  durable: true,          // La cola sobrevive a reinicios del broker
  autoDelete: false,      // La cola no se elimina automáticamente cuando no hay consumidores
  exclusive: false,       // La cola puede ser accedida por múltiples conexiones
  arguments: {
    'x-dead-letter-exchange': RABBITMQ_DLX_EXCHANGE,
    'x-dead-letter-routing-key': 'fallidos'
  }
};

// Colas de mensajes fallidos (DLQ) para cada servicio principal
const COLAS_FALLIDOS = [
  'mapyourworld_api-gateway_fallidos_eventos_auth',
  'mapyourworld_api-gateway_fallidos_eventos_mapas',
  'mapyourworld_api-gateway_fallidos_eventos_notificaciones',
  'mapyourworld_api-gateway_fallidos_eventos_sociales',
  'mapyourworld_api-gateway_fallidos_eventos_usuarios',
  'mapyourworld_api-gateway_fallidos_eventos_notificaciones'
];

// Configuración para las colas de mensajes fallidos
const COLA_FALLIDOS_CONFIG = {
  durable: true,
  autoDelete: false,
  exclusive: false,
  arguments: {
    // TTL para mensajes en cola fallida (2 horas = 7.200.000 ms)
    'x-message-ttl': 7200000
  }
};

/**
 * Crea todas las colas requeridas en RabbitMQ si no existen
 */
export async function crearColasRequeridas(): Promise<void> {
  try {
    // Conexión a RabbitMQ
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    
    // Asegurar que el exchange existe
    await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', {
      durable: true,
      autoDelete: false
    });
    
    console.log(`[colas] Exchange "${RABBITMQ_EXCHANGE}" verificado/creado`);
    
    // Crear colas principales y enlazarlas al exchange
    for (const cola of COLAS_REQUERIDAS) {
      if (process.env.RABBITMQ_FORCE_SETUP === 'true') {
        try {
          await channel.deleteQueue(cola);
          console.log(`[colas] Cola "${cola}" eliminada por configuración forzada`);
        } catch (err) {
          console.log(`[colas] No se pudo eliminar la cola "${cola}": ${err}`);
        }
      }
      await channel.assertQueue(cola, COLA_CONFIG);
      console.log(`[colas] Cola "${cola}" verificada/creada`);
      
      // Determinar las claves de enrutamiento según el nombre de la cola
      let clavesEnrutamiento: string[] = [];
      
      if (cola.includes('eventos_auth')) {
        clavesEnrutamiento = ['auth.*'];
      } else if (cola.includes('eventos_mapas')) {
        clavesEnrutamiento = ['mapas.*'];
      } else if (cola.includes('eventos_notificaciones')) {
        clavesEnrutamiento = ['notificaciones.*'];
      } else if (cola.includes('eventos_sociales')) {
        clavesEnrutamiento = ['sociales.*'];
      } else if (cola.includes('eventos_usuarios')) {
        clavesEnrutamiento = ['usuarios.*'];
      } else if (cola.includes('notificaciones') && !cola.includes('eventos_')) {
        clavesEnrutamiento = ['notificacion.*'];
      }
      
      // Enlazar la cola con el exchange para cada clave de enrutamiento
      for (const clave of clavesEnrutamiento) {
        await channel.bindQueue(cola, RABBITMQ_EXCHANGE, clave);
        console.log(`[colas] Cola "${cola}" enlazada a "${RABBITMQ_EXCHANGE}" con clave "${clave}"`);
      }
    }
    
    // Crear colas de mensajes fallidos y enlazarlas al exchange
    for (const colaFallidos of COLAS_FALLIDOS) {
      if (process.env.RABBITMQ_FORCE_SETUP === 'true') {
        try {
          await channel.deleteQueue(colaFallidos);
          console.log(`[colas] Cola de DLQ "${colaFallidos}" eliminada por configuración forzada`);
        } catch (err) {
          console.log(`[colas] No se pudo eliminar la cola de DLQ "${colaFallidos}": ${err}`);
        }
      }
      await channel.assertQueue(colaFallidos, COLA_FALLIDOS_CONFIG);
      console.log(`[colas] Cola de mensajes fallidos "${colaFallidos}" verificada/creada`);
      
      // Extraer el tipo de servicio de la cola (auth, mapas, etc.)
      const tipoServicio = colaFallidos.split('fallidos_eventos_')[1];
      if (tipoServicio) {
        const claveEnrutamiento = `fallidos.${tipoServicio}.*`;
        await channel.bindQueue(colaFallidos, RABBITMQ_EXCHANGE, claveEnrutamiento);
        console.log(`[colas] Cola "${colaFallidos}" enlazada a "${RABBITMQ_EXCHANGE}" con clave "${claveEnrutamiento}"`);
      } else if (colaFallidos.includes('fallidos_notificaciones')) {
        await channel.bindQueue(colaFallidos, RABBITMQ_EXCHANGE, 'fallidos.notificacion.*');
        console.log(`[colas] Cola "${colaFallidos}" enlazada a "${RABBITMQ_EXCHANGE}" con clave "fallidos.notificacion.*"`);
      }
    }
    
    console.log('[colas] Todas las colas requeridas han sido verificadas/creadas correctamente');
    
    // Cerrar canal y conexión
    await channel.close();
    await connection.close();
    
  } catch (error) {
    console.error('[colas] Error al crear las colas requeridas:', error);
    throw error;
  }
}

// Si el script se ejecuta directamente, llamar a la función
if (require.main === module) {
  console.log('Iniciando creación de colas RabbitMQ...');
  
  crearColasRequeridas()
    .then(() => {
      console.log('Creación de colas completada con éxito.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error al crear colas:', error);
      process.exit(1);
    });
} 