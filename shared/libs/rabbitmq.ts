/**
 * Cliente de RabbitMQ para comunicación entre servicios
 * Este archivo proporciona funciones para conectar, publicar y suscribirse a eventos
 */

import * as amqplib from 'amqplib';

// Variables de entorno para la conexión a RabbitMQ
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || '5672';
const RABBITMQ_VHOST = process.env.RABBITMQ_VHOST || '/';

// URL de conexión a RabbitMQ
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}${RABBITMQ_VHOST}`;

// Nombre del exchange principal para los eventos del sistema
const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE || 'mapyourworld';

// Variable para almacenar la conexión activa y el canal
let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

// Interfaz para la conexión
export interface ConnectionObject {
  connection: amqplib.Connection;
  channel: amqplib.Channel;
}

// Interfaz para mensajes de eventos
export interface EventMessage {
  [key: string]: any;
}

// Tipo para la función de callback al recibir mensajes
export type MessageCallback = (content: EventMessage, routingKey: string) => Promise<void> | void;

/**
 * Establece la conexión con RabbitMQ
 * @param retryCount Número de intentos de reconexión realizados
 * @returns Objeto con la conexión y el canal
 */
export const connect = async (retryCount = 0): Promise<ConnectionObject> => {
  try {
    // Máximo de intentos de reconexión
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 5000; // 5 segundos

    if (connection && channel) {
      return { connection, channel };
    }

    console.log('Conectando a RabbitMQ...');
    
    // Establecer conexión
    connection = await amqplib.connect(RABBITMQ_URL);
    
    // Crear canal
    channel = await connection.createChannel();
    
    // Declarar el exchange principal (topic para enrutamiento por temas)
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    // Manejar cierre de conexión
    connection.on('close', async () => {
      console.warn('Conexión a RabbitMQ cerrada, intentando reconectar...');
      connection = null;
      channel = null;
      await reconnect();
    });
    
    // Manejar errores de conexión
    connection.on('error', async (err) => {
      console.error('Error en conexión a RabbitMQ:', err);
      if (connection) {
        try {
          await connection.close();
        } catch (e) {
          console.error('Error al cerrar conexión a RabbitMQ:', e);
        }
      }
      connection = null;
      channel = null;
      await reconnect();
    });
    
    console.log('Conexión a RabbitMQ establecida exitosamente');
    return { connection, channel };
  } catch (error) {
    console.error(`Error al conectar a RabbitMQ (intento ${retryCount + 1}):`, error);
    
    // Intentar reconexión con backoff exponencial
    if (retryCount < 5) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      console.log(`Reintentando conexión en ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return connect(retryCount + 1);
    }
    
    throw error;
  }
};

/**
 * Intenta reconectar a RabbitMQ
 */
export const reconnect = async (): Promise<void> => {
  try {
    await connect();
  } catch (error) {
    console.error('Error al reconectar a RabbitMQ:', error);
  }
};

/**
 * Publica un evento en RabbitMQ
 * @param routingKey Clave de enrutamiento para el evento
 * @param message Mensaje/datos del evento
 */
export const publishEvent = async (routingKey: string, message: EventMessage): Promise<void> => {
  try {
    if (!channel) {
      await connect();
    }
    
    if (!channel) {
      throw new Error('No se pudo establecer conexión a RabbitMQ');
    }
    
    // Convertir el mensaje a buffer
    const content = Buffer.from(JSON.stringify(message));
    
    // Publicar el mensaje
    const published = channel.publish(EXCHANGE_NAME, routingKey, content, {
      persistent: true, // Guardar mensaje en disco para garantizar entrega
      contentType: 'application/json'
    });
    
    if (!published) {
      console.warn(`Buffer de RabbitMQ lleno, el mensaje para ${routingKey} será bloqueante`);
    }
    
  } catch (error) {
    console.error(`Error al publicar evento ${routingKey}:`, error);
    
    // Intentar reconectar y publicar nuevamente
    try {
      await reconnect();
      if (channel) {
        const content = Buffer.from(JSON.stringify(message));
        channel.publish(EXCHANGE_NAME, routingKey, content, {
          persistent: true,
          contentType: 'application/json'
        });
      }
    } catch (reconnectError) {
      console.error('Error al reconectar y publicar evento:', reconnectError);
      throw reconnectError;
    }
  }
};

/**
 * Suscribe a eventos de RabbitMQ
 * @param queueName Nombre de la cola a la que suscribirse
 * @param routingKeys Claves de enrutamiento de los eventos
 * @param callback Función a ejecutar al recibir mensajes
 * @returns Nombre de la cola creada
 */
export const subscribeToEvents = async (
  queueName: string, 
  routingKeys: string[], 
  callback: MessageCallback
): Promise<string> => {
  try {
    if (!channel) {
      await connect();
    }
    
    if (!channel) {
      throw new Error('No se pudo establecer conexión a RabbitMQ');
    }
    
    // Asegurarse de que el nombre de la cola es válido
    const safeQueueName = queueName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    
    // Declarar la cola
    const { queue } = await channel.assertQueue(safeQueueName, {
      durable: true, // La cola sobrevive a reinicios
      exclusive: false // Puede ser accedida por múltiples conexiones
    });
    
    console.log(`Cola ${queue} creada exitosamente`);
    
    // Enlazar la cola al exchange para cada routing key
    for (const routingKey of routingKeys) {
      await channel.bindQueue(queue, EXCHANGE_NAME, routingKey);
      console.log(`Cola ${queue} enlazada a routing key: ${routingKey}`);
    }
    
    // Consumir mensajes de la cola
    await channel.consume(queue, async (msg) => {
      if (!msg) return;
      
      try {
        // Extraer routing key y contenido
        const routingKey = msg.fields.routingKey;
        const content = JSON.parse(msg.content.toString());
        
        // Procesar el mensaje con la función callback
        await Promise.resolve(callback(content, routingKey));
        
        // Confirmar procesamiento exitoso
        channel?.ack(msg);
      } catch (error) {
        console.error('Error procesando mensaje de RabbitMQ:', error);
        
        // Si no se puede procesar después de varios intentos, 
        // posiblemente rechazar o mover a una cola de "dead letter"
        channel?.nack(msg, false, false);
      }
    });
    
    console.log(`Suscripción a cola ${queue} establecida exitosamente`);
    return queue;
  } catch (error) {
    console.error('Error al suscribirse a eventos:', error);
    
    // Intentar reconectar
    try {
      await reconnect();
      return subscribeToEvents(queueName, routingKeys, callback);
    } catch (reconnectError) {
      console.error('Error al reconectar y suscribirse:', reconnectError);
      throw reconnectError;
    }
  }
};

/**
 * Cierra la conexión a RabbitMQ
 */
export const closeConnection = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    
    if (connection) {
      await connection.close();
      connection = null;
    }
    
    console.log('Conexión a RabbitMQ cerrada exitosamente');
  } catch (error) {
    console.error('Error al cerrar conexión a RabbitMQ:', error);
    
    // Forzar limpieza de recursos
    channel = null;
    connection = null;
  }
}; 