/**
 * Biblioteca compartida para la conexión con RabbitMQ
 * Proporciona funciones para publicar y suscribirse a eventos
 */

const amqplib = require('amqplib');

// Configuración desde variables de entorno
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`;

// Nombre del exchange principal para los eventos
const EXCHANGE = 'mapyourworld.events';

// Retries para conexión
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

// Variables para mantener la conexión
let connection = null;
let channel = null;

/**
 * Inicializa la conexión con RabbitMQ
 * @returns {Promise<Object>} Objeto con la conexión y el canal
 */
const connect = async (retryCount = 0) => {
  try {
    // Reutilizar conexión existente
    if (connection && channel) {
      return { connection, channel };
    }

    // Crear nueva conexión
    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declarar exchange principal de tipo topic
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    
    console.log('Conectado a RabbitMQ correctamente');
    
    // Manejar errores y reconexión
    connection.on('error', async (error) => {
      console.error('Error en conexión RabbitMQ:', error.message);
      await reconnect();
    });
    
    connection.on('close', async () => {
      console.warn('Conexión RabbitMQ cerrada. Intentando reconectar...');
      await reconnect();
    });
    
    return { connection, channel };
  } catch (error) {
    console.error(`Error al conectar con RabbitMQ: ${error.message}`);
    
    // Reintentar si no se ha excedido el máximo
    if (retryCount < MAX_RETRIES) {
      console.log(`Reintentando conexión en ${RETRY_DELAY / 1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connect(retryCount + 1);
    }
    
    throw new Error(`No se pudo conectar a RabbitMQ después de ${MAX_RETRIES} intentos`);
  }
};

/**
 * Reconecta cuando hay error
 */
const reconnect = async () => {
  connection = null;
  channel = null;
  await connect();
};

/**
 * Publica un evento en RabbitMQ
 * @param {string} routingKey - La clave de enrutamiento (ej: 'distrito.desbloqueado')
 * @param {Object} message - El objeto de mensaje a publicar
 */
const publishEvent = async (routingKey, message) => {
  try {
    if (!channel) {
      await connect();
    }
    
    await channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`Evento publicado: ${routingKey}`);
  } catch (error) {
    console.error(`Error al publicar evento ${routingKey}:`, error.message);
    throw error;
  }
};

/**
 * Suscribe a eventos de RabbitMQ
 * @param {string} queueName - Nombre de la cola para el consumidor
 * @param {string[]} routingKeys - Array de patrones de enrutamiento (ej: ['distrito.*', 'foto.subida'])
 * @param {Function} callback - Función a ejecutar cuando se recibe un mensaje
 */
const subscribeToEvents = async (queueName, routingKeys, callback) => {
  try {
    if (!channel) {
      await connect();
    }
    
    // Crear cola con nombre específico
    const { queue } = await channel.assertQueue(queueName, { 
      durable: true,
      autoDelete: false
    });
    
    // Suscribirse a todos los routing keys proporcionados
    for (const routingKey of routingKeys) {
      await channel.bindQueue(queue, EXCHANGE, routingKey);
      console.log(`Suscrito a eventos: ${routingKey}`);
    }
    
    // Consumir mensajes
    await channel.consume(queue, async (msg) => {
      if (!msg) return;
      
      try {
        const content = JSON.parse(msg.content.toString());
        const routingKey = msg.fields.routingKey;
        
        // Llamar al callback con el mensaje y el routing key
        await callback(content, routingKey);
        
        // Confirmar procesamiento
        channel.ack(msg);
      } catch (error) {
        console.error('Error procesando mensaje:', error.message);
        // Rechazar mensaje y volver a encolar
        channel.nack(msg, false, true);
      }
    });
    
    return queue;
  } catch (error) {
    console.error('Error al suscribirse a eventos:', error.message);
    throw error;
  }
};

/**
 * Cierra la conexión con RabbitMQ
 */
const closeConnection = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  
  connection = null;
  channel = null;
  console.log('Conexión RabbitMQ cerrada correctamente');
};

module.exports = {
  connect,
  publishEvent,
  subscribeToEvents,
  closeConnection
}; 