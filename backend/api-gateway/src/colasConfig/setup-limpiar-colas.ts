/**
 * Script para limpiar TODAS las colas en RabbitMQ sin excepción
 * 
 * Ejecutar con: npx ts-node src/colasConfig/setup-limpiar-colas.ts
 */

import fetch from 'node-fetch';
import amqp from 'amqplib';

// Definición del tipo de respuesta de la API de RabbitMQ Management
interface RabbitMQQueue {
  name: string;
  vhost: string;
  durable: boolean;
  auto_delete: boolean;
  exclusive: boolean;
  arguments: Record<string, any>;
  [key: string]: any;
}

/**
 * Purga todas las colas conocidas sin excepción.
 */
export async function purgarColas(): Promise<void> {
  // 1. Datos para acceder a la API de Management de RabbitMQ
  //    Ajusta URL, usuario y contraseña según tu entorno
  const RABBITMQ_MANAGEMENT_URL = 'http://localhost:15672/api/queues';
  const RABBIT_USER = 'guest';
  const RABBIT_PASS = 'guest';

  // 2. Obtenemos la lista de colas a través de la API de Management
  const response = await fetch(RABBITMQ_MANAGEMENT_URL, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${RABBIT_USER}:${RABBIT_PASS}`).toString('base64'),
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`No se pudo obtener la lista de colas. Status: ${response.status}`);
  }

  // Parsear la respuesta JSON como un array de objetos RabbitMQQueue
  const allQueues = await response.json() as RabbitMQQueue[];

  // 3. Conexión AMQP para eliminar colas
  //    Ajusta el host/puerto si no usas localhost:5672
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();

  // 4. Iteramos sobre todas las colas encontradas
  for (const queue of allQueues) {
    const queueName = queue.name;
    
    // Eliminamos todas las colas sin excepción
    console.log(`Eliminando cola: ${queueName}`);
    await channel.deleteQueue(queueName);
  }

  // 5. Cerramos canal y conexión
  await channel.close();
  await connection.close();

  console.log('Proceso de purga de colas completado.');
}

// Si el script se ejecuta directamente, llamar a la función
if (require.main === module) {
  console.log('Iniciando limpieza de TODAS las colas RabbitMQ...');
  
  purgarColas()
    .then(() => {
      console.log('Limpieza de colas completada con éxito.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error al limpiar colas:', error);
      process.exit(1);
    });
} 