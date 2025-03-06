/**
 * @fileoverview Implementación de RabbitMQ para el API Gateway
 * 
 * Este módulo proporciona una interfaz unificada para conectarse y utilizar RabbitMQ
 * en la comunicación entre microservicios. Incluye la clase ConectorRabbitMQ y
 * funciones auxiliares para simplificar su uso.
 * 
 * @module RabbitMQ
 */

import * as amqplib from 'amqplib';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';
import {
  TipoEvento,
  MensajeEvento,
  CallbackMensaje,
  EventosConectorRabbitMQ
} from './rabbit-mq.types';

// Cargar variables de entorno
dotenv.config();

// Configuración de RabbitMQ desde variables de entorno
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = parseInt(process.env.RABBITMQ_PORT || '5672', 10);
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';
const RABBITMQ_VHOST = process.env.RABBITMQ_VHOST || '/';
const RABBITMQ_EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'mapyourworld';
const RABBITMQ_QUEUE_PREFIX = process.env.RABBITMQ_QUEUE_PREFIX || 'mapyourworld_';
const RABBITMQ_RETRY_ATTEMPTS = parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || '5', 10);
const RABBITMQ_RETRY_DELAY = parseInt(process.env.RABBITMQ_RETRY_DELAY || '5000', 10);

// URL de conexión para RabbitMQ
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}${RABBITMQ_VHOST}`;

/**
 * Clase para gestionar la conexión y comunicación con RabbitMQ
 * Implementa el patrón EventEmitter para notificar eventos
 * 
 * @class ConectorRabbitMQ
 * @extends {EventEmitter}
 */
class ConectorRabbitMQ extends EventEmitter {
  /** @private Conexión a RabbitMQ */
  private conexion: amqplib.Connection | null = null;
  
  /** @private Canal de comunicación con RabbitMQ */
  private canal: amqplib.Channel | null = null;
  
  /** @private Registro de suscripciones activas */
  private suscripciones: Map<string, { cola: string, clavesEnrutamiento: string[] }> = new Map();
  
  /** @private Nombre del servicio que utiliza la conexión */
  private nombreServicio: string = 'desconocido';
  
  /** @private Contador de intentos de reconexión */
  private intentosReconexion: number = 0;
  
  /** @private Indicador de reconexión en proceso */
  private reconectando: boolean = false;
  
  /** @private Intervalo para verificar estado de la conexión */
  private intervaloPing: NodeJS.Timeout | null = null;
  
  /** @private Indicador de inicialización */
  private iniciado: boolean = false;

  /**
   * Crea una instancia del conector RabbitMQ
   * @param {string} nombreServicio - Nombre del servicio que utilizará la conexión
   */
  constructor(nombreServicio: string) {
    super();
    this.nombreServicio = nombreServicio || 'desconocido';
    
    // Configurar manejo de errores no capturados
    this.on('error', this.manejarErrorNoCapturado.bind(this));
  }

  /**
   * Inicia la conexión con RabbitMQ
   * 
   * @returns {Promise<void>}
   * @throws {Error} Si ocurre un error durante la inicialización
   */
  public async iniciar(): Promise<void> {
    if (this.iniciado) {
      console.log(`[RabbitMQ:${this.nombreServicio}] Ya se encuentra iniciado`);
      return;
    }

    try {
      await this.conectar();
      
      // Crear la cola de ping durante la inicialización
      if (this.canal) {
        const nombreCola = `${RABBITMQ_QUEUE_PREFIX}${this.nombreServicio}_ping`;
        await this.canal.assertQueue(nombreCola, {
          durable: true,
          exclusive: false,
          autoDelete: false
        });
        console.log(`[RabbitMQ:${this.nombreServicio}] Cola de ping creada: ${nombreCola}`);
      }
      
      this.iniciarPing();
      this.iniciado = true;
      this.emit('iniciado');
      console.log(`[RabbitMQ:${this.nombreServicio}] Iniciado correctamente`);
    } catch (error) {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error al iniciar:`, error);
      this.emit('error', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Establece la conexión con el servidor RabbitMQ
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async conectar(): Promise<void> {
    try {
      console.log(`[RabbitMQ:${this.nombreServicio}] Conectando a ${RABBITMQ_URL}...`);
      
      // Establecer conexión con el servidor
      this.conexion = await amqplib.connect(RABBITMQ_URL) as unknown as amqplib.Connection;
      
      // Crear canal de comunicación
      if (this.conexion) {
        this.canal = await this.conexion.createChannel();
        
        // Configurar exchange
        if (this.canal) {
          await this.canal.assertExchange(RABBITMQ_EXCHANGE, 'topic', {
            durable: true,
            autoDelete: false
          });
          
          // Configurar prefetch para control de carga
          await this.canal.prefetch(1);
          
          // Configurar eventos de conexión
          this.configurarEventosConexion();
          
          this.intentosReconexion = 0;
          this.reconectando = false;
          
          console.log(`[RabbitMQ:${this.nombreServicio}] Conectado correctamente`);
          this.emit('conectado');
        }
      }
    } catch (error) {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error al conectar:`, error);
      this.emit('error', error instanceof Error ? error : new Error(String(error)));
      
      // Intentar reconexión
      await this.manejarReconexion();
    }
  }

  /**
   * Configura los listeners para eventos de la conexión
   * 
   * @private
   */
  private configurarEventosConexion(): void {
    if (!this.conexion) return;
    
    // Evento cuando la conexión se cierra
    this.conexion.on('close', async () => {
      console.warn(`[RabbitMQ:${this.nombreServicio}] Conexión cerrada`);
      this.emit('desconectado');
      
      this.conexion = null;
      this.canal = null;
      
      // Intentar reconexión si no estamos en proceso de reconexión
      if (!this.reconectando) {
        await this.manejarReconexion();
      }
    });
    
    // Evento cuando ocurre un error en la conexión
    this.conexion.on('error', async (error) => {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error en conexión:`, error);
      this.emit('error', error);
      
      // Intentar reconexión si no estamos en proceso de reconexión
      if (!this.reconectando) {
        await this.manejarReconexion();
      }
    });
  }

  /**
   * Maneja el proceso de reconexión con estrategia de backoff exponencial
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async manejarReconexion(): Promise<void> {
    if (this.reconectando) return;
    
    this.reconectando = true;
    this.intentosReconexion++;
    
    // Calcular tiempo de espera con backoff exponencial
    const retraso = Math.min(
      RABBITMQ_RETRY_DELAY * Math.pow(1.5, this.intentosReconexion - 1),
      60000 // Máximo 1 minuto
    );
    
    console.log(`[RabbitMQ:${this.nombreServicio}] Intentando reconexión ${this.intentosReconexion}/${RABBITMQ_RETRY_ATTEMPTS} en ${retraso}ms...`);
    this.emit('reconectando', this.intentosReconexion, retraso);
    
    // Esperar antes de reconectar
    await new Promise(resolve => setTimeout(resolve, retraso));
    
    try {
      await this.conectar();
      
      // Si la reconexión tuvo éxito, restaurar suscripciones
      if (this.conexion && this.canal) {
        await this.restaurarSuscripciones();
      }
    } catch (error) {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error en reconexión:`, error);
      
      // Si agotamos los intentos, emitir evento de fallo
      if (this.intentosReconexion >= RABBITMQ_RETRY_ATTEMPTS) {
        console.error(`[RabbitMQ:${this.nombreServicio}] Agotados los intentos de reconexión`);
        this.emit('reconexionFallida');
        this.reconectando = false;
        return;
      }
      
      // Intentar nuevamente
      this.reconectando = false;
      await this.manejarReconexion();
    }
  }

  /**
   * Restaura las suscripciones activas después de una reconexión
   * 
   * @private
   * @returns {Promise<void>}
   */
  private async restaurarSuscripciones(): Promise<void> {
    if (!this.canal || this.suscripciones.size === 0) return;
    
    console.log(`[RabbitMQ:${this.nombreServicio}] Restaurando ${this.suscripciones.size} suscripciones...`);
    
    let suscripcionesRestauradas = 0;
    
    for (const [id, datos] of this.suscripciones.entries()) {
      try {
        const { cola, clavesEnrutamiento } = datos;
        
        // Recrear la cola
        await this.canal.assertQueue(cola, {
          durable: true,
          exclusive: false,
          autoDelete: false
        });
        
        // Vincular con las claves de enrutamiento
        for (const clave of clavesEnrutamiento) {
          await this.canal.bindQueue(cola, RABBITMQ_EXCHANGE, clave);
        }
        
        console.log(`[RabbitMQ:${this.nombreServicio}] Suscripción restaurada: ${cola}`);
        this.emit('suscripcionRestaurada', cola);
        suscripcionesRestauradas++;
      } catch (error) {
        console.error(`[RabbitMQ:${this.nombreServicio}] Error al restaurar suscripción ${id}:`, error);
        this.emit('error', error instanceof Error ? error : new Error(String(error)));
        // Continuamos con la siguiente suscripción
      }
    }
    
    if (suscripcionesRestauradas === this.suscripciones.size) {
      console.log(`[RabbitMQ:${this.nombreServicio}] Todas las suscripciones restauradas`);
    } else {
      console.warn(`[RabbitMQ:${this.nombreServicio}] Restauradas ${suscripcionesRestauradas}/${this.suscripciones.size} suscripciones`);
    }
  }

  /**
   * Inicia un ping periódico para verificar la conexión
   * 
   * @private
   */
  private iniciarPing(): void {
    if (this.intervaloPing) {
      clearInterval(this.intervaloPing);
    }
    
    this.intervaloPing = setInterval(async () => {
      if (!this.conexion || !this.canal) {
        console.warn(`[RabbitMQ:${this.nombreServicio}] Conexión perdida durante ping, intentando reconectar...`);
        
        if (!this.reconectando) {
          await this.manejarReconexion();
        }
        return;
      }
      
      try {
        // Declarar la cola antes de verificarla para asegurar que existe
        const nombreCola = `${RABBITMQ_QUEUE_PREFIX}${this.nombreServicio}_ping`;
        await this.canal.assertQueue(nombreCola, {
          durable: true,
          exclusive: false,
          autoDelete: false
        });
        
        // Verificar que el canal está activo
        await this.canal.checkQueue(nombreCola);
        // console.log(`[RabbitMQ:${this.nombreServicio}] Ping exitoso`);
      } catch (error) {
        console.warn(`[RabbitMQ:${this.nombreServicio}] Error en ping:`, error);
        
        if (!this.reconectando) {
          await this.manejarReconexion();
        }
      }
    }, 30000); // Cada 30 segundos
  }

  /**
   * Publica un evento en el exchange
   * 
   * @param {string | TipoEvento} tipo - Tipo de evento a publicar
   * @param {any} datos - Datos del evento
   * @param {Partial<MensajeEvento['metadatos']>} metadatos - Metadatos adicionales
   * @returns {Promise<boolean>} - True si se publicó correctamente
   */
  public async publicarEvento(
    tipo: string | TipoEvento,
    datos: any,
    metadatos: Partial<MensajeEvento['metadatos']> = {}
  ): Promise<boolean> {
    if (!this.canal || !this.conexion) {
      console.warn(`[RabbitMQ:${this.nombreServicio}] Intento de publicar sin conexión activa`);
      
      // Intentar reconectar si no estamos en proceso
      if (!this.reconectando) {
        await this.manejarReconexion();
      }
      
      // Si sigue sin conexión, falla
      if (!this.canal || !this.conexion) {
        throw new Error(`No hay conexión a RabbitMQ para publicar evento ${tipo}`);
      }
    }
    
    try {
      // Crear mensaje de evento
      const mensaje: MensajeEvento = {
        tipo,
        datos,
        metadatos: {
          timestamp: Date.now(),
          servicioOrigen: this.nombreServicio,
          idCorrelacion: metadatos.idCorrelacion || crearIdCorrelacion(),
          ...metadatos
        }
      };
      
      // Convertir a buffer
      const contenido = Buffer.from(JSON.stringify(mensaje));
      
      // Crear clave de enrutamiento a partir del tipo
      const claveEnrutamiento = aClaveEnrutamiento(tipo.toString());
      
      // Publicar en el exchange
      const resultado = this.canal.publish(RABBITMQ_EXCHANGE, claveEnrutamiento, contenido, {
        persistent: true,
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        messageId: mensaje.metadatos.idCorrelacion,
        timestamp: mensaje.metadatos.timestamp,
        headers: {
          'x-servicio-origen': this.nombreServicio,
          'x-usuario-id': mensaje.metadatos.idUsuario || '',
          'x-dispositivo-id': mensaje.metadatos.idDispositivo || ''
        }
      });
      
      if (resultado) {
        // console.log(`[RabbitMQ:${this.nombreServicio}] Evento publicado: ${tipo}`);
        this.emit('eventoPublicado', tipo.toString(), mensaje);
      } else {
        console.warn(`[RabbitMQ:${this.nombreServicio}] Buffer lleno al publicar: ${tipo}`);
        this.emit('bufferLleno', tipo.toString());
      }
      
      return resultado;
    } catch (error) {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error al publicar evento ${tipo}:`, error);
      this.emit('errorPublicacion', tipo.toString(), error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Suscribe a eventos específicos mediante claves de enrutamiento
   * 
   * @param {string} nombreCola - Nombre de la cola para la suscripción
   * @param {string[]} clavesEnrutamiento - Claves de enrutamiento (pueden usar wildcards)
   * @param {CallbackMensaje} callback - Función a ejecutar cuando llega un mensaje
   * @returns {Promise<string>} - ID único de la suscripción
   */
  public async suscribirseAEventos(
    nombreCola: string,
    clavesEnrutamiento: string[],
    callback: CallbackMensaje
  ): Promise<string> {
    if (!this.canal || !this.conexion) {
      console.warn(`[RabbitMQ:${this.nombreServicio}] Intento de suscribirse sin conexión activa`);
      
      // Intentar reconectar si no estamos en proceso
      if (!this.reconectando) {
        await this.manejarReconexion();
      }
      
      // Si sigue sin conexión, falla
      if (!this.canal || !this.conexion) {
        throw new Error(`No hay conexión a RabbitMQ para suscribirse a ${nombreCola}`);
      }
    }
    
    try {
      // Asegurar que las claves sean válidas
      const claves = clavesEnrutamiento.map(clave => aClaveEnrutamiento(clave));
      
      // Crear cola con prefijo del servicio
      const nombreColaCompleto = `${RABBITMQ_QUEUE_PREFIX}${this.nombreServicio}_${nombreCola}`;
      
      // Declarar la cola
      await this.canal.assertQueue(nombreColaCompleto, {
        durable: true,
        exclusive: false,
        autoDelete: false
      });
      
      // Vincular la cola al exchange con cada clave de enrutamiento
      for (const clave of claves) {
        await this.canal.bindQueue(nombreColaCompleto, RABBITMQ_EXCHANGE, clave);
      }
      
      // Generar ID único para esta suscripción
      const idSuscripcion = `${this.nombreServicio}_${nombreCola}_${Date.now()}`;
      
      // Guardar datos de suscripción para reconexiones
      this.suscripciones.set(idSuscripcion, {
        cola: nombreColaCompleto,
        clavesEnrutamiento: claves
      });
      
      // Consumir mensajes de la cola
      await this.canal.consume(
        nombreColaCompleto,
        async (msg) => {
          if (!msg) return; // Mensaje nulo, ignorar
          
          try {
            // Obtener contenido y clave de enrutamiento
            const contenido = msg.content.toString();
            const claveEnrutamiento = msg.fields.routingKey;
            
            // Parsear mensaje
            const mensaje = JSON.parse(contenido) as MensajeEvento;
            
            // Emitir evento
            this.emit('mensajeRecibido', claveEnrutamiento, mensaje);
            
            // Ejecutar callback
            await Promise.resolve(callback(mensaje, claveEnrutamiento));
            
            // Confirmar procesamiento
            this.canal?.ack(msg);
          } catch (error) {
            console.error(`[RabbitMQ:${this.nombreServicio}] Error al procesar mensaje:`, error);
            this.emit('errorProcesamiento', error instanceof Error ? error : new Error(String(error)));
            
            // Rechazar mensaje (requeue=false para no volver a procesarlo)
            if (this.canal) {
              this.canal.nack(msg, false, false);
              this.emit('mensajeDescartado', msg);
            }
          }
        },
        {
          noAck: false, // Requiere confirmación explícita
        }
      );
      
      console.log(`[RabbitMQ:${this.nombreServicio}] Suscripción establecida: ${nombreColaCompleto} -> ${claves.join(', ')}`);
      this.emit('suscripcionEstablecida', nombreColaCompleto, claves);
      
      return idSuscripcion;
    } catch (error) {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error al suscribirse:`, error);
      this.emit('errorSuscripcion', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Maneja errores no capturados en el emisor de eventos
   * 
   * @private
   * @param {Error} error - Error ocurrido
   */
  private manejarErrorNoCapturado(error: Error): void {
    console.error(`[RabbitMQ:${this.nombreServicio}] Error no capturado:`, error);
    this.emit('errorNoCapturado', error);
  }

  /**
   * Detiene la conexión con RabbitMQ
   * 
   * @returns {Promise<void>}
   */
  public async detener(): Promise<void> {
    try {
      // Detener ping
      if (this.intervaloPing) {
        clearInterval(this.intervaloPing);
        this.intervaloPing = null;
      }
      
      // Cerrar canal
      if (this.canal) {
        await this.canal.close();
        this.canal = null;
      }
      
      // Cerrar conexión
      if (this.conexion) {
        await this.conexion.close();
        this.conexion = null;
      }
      
      this.iniciado = false;
      this.suscripciones.clear();
      
      console.log(`[RabbitMQ:${this.nombreServicio}] Conexión cerrada correctamente`);
      this.emit('detenido');
    } catch (error) {
      console.error(`[RabbitMQ:${this.nombreServicio}] Error al detener conexión:`, error);
      this.emit('errorAlDetener', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
}

// Instancias de conexión por servicio
const conectores = new Map<string, ConectorRabbitMQ>();

/**
 * Obtiene o crea un conector RabbitMQ para un servicio
 * 
 * @param {string} nombreServicio - Nombre del servicio
 * @returns {ConectorRabbitMQ} - Instancia del conector
 */
export function obtenerConectorRabbitMQ(nombreServicio: string): ConectorRabbitMQ {
  if (!conectores.has(nombreServicio)) {
    conectores.set(nombreServicio, new ConectorRabbitMQ(nombreServicio));
  }
  
  return conectores.get(nombreServicio)!;
}

/**
 * Inicializa la conexión con RabbitMQ para un servicio
 * 
 * @param {string} nombreServicio - Nombre del servicio
 * @returns {Promise<ConectorRabbitMQ>} - Instancia del conector inicializado
 */
export async function inicializarRabbitMQ(nombreServicio: string): Promise<ConectorRabbitMQ> {
  const conector = obtenerConectorRabbitMQ(nombreServicio);
  await conector.iniciar();
  return conector;
}

/**
 * Publica un evento en RabbitMQ
 * 
 * @param {string} nombreServicio - Nombre del servicio que publica
 * @param {TipoEvento | string} tipo - Tipo de evento
 * @param {any} datos - Datos del evento
 * @param {string} [idUsuario] - ID del usuario relacionado
 * @param {string} [idCorrelacion] - ID de correlación para seguimiento
 * @returns {Promise<boolean>} - True si se publicó correctamente
 */
export async function publicarEvento(
  nombreServicio: string,
  tipo: TipoEvento | string,
  datos: any,
  idUsuario?: string,
  idCorrelacion?: string
): Promise<boolean> {
  const conector = obtenerConectorRabbitMQ(nombreServicio);
  
  // Inicializar si no está iniciado
  if (!conector.listenerCount('conectado')) {
    await conector.iniciar();
  }
  
  return await conector.publicarEvento(tipo, datos, {
    idUsuario,
    idCorrelacion: idCorrelacion || crearIdCorrelacion()
  });
}

/**
 * Suscribe a eventos específicos
 * 
 * @param {string} nombreServicio - Nombre del servicio que se suscribe
 * @param {string} nombreCola - Nombre de la cola
 * @param {(TipoEvento | string)[]} tiposEventos - Tipos de eventos a suscribirse
 * @param {CallbackMensaje} callback - Función a ejecutar cuando llega un mensaje
 * @returns {Promise<string>} - ID único de la suscripción
 */
export async function suscribirseAEventos(
  nombreServicio: string,
  nombreCola: string,
  tiposEventos: (TipoEvento | string)[],
  callback: CallbackMensaje
): Promise<string> {
  const conector = obtenerConectorRabbitMQ(nombreServicio);
  
  // Inicializar si no está iniciado
  if (!conector.listenerCount('conectado')) {
    await conector.iniciar();
  }
  
  return await conector.suscribirseAEventos(
    nombreCola,
    tiposEventos.map(tipo => tipo.toString()),
    callback
  );
}

/**
 * Suscribe a todos los eventos de una categoría
 * 
 * @param {string} nombreServicio - Nombre del servicio que se suscribe
 * @param {string} nombreCola - Nombre de la cola
 * @param {string} categoria - Categoría de eventos (ej: "usuario", "mapa")
 * @param {CallbackMensaje} callback - Función a ejecutar cuando llega un mensaje
 * @returns {Promise<string>} - ID único de la suscripción
 */
export async function suscribirseACategoria(
  nombreServicio: string,
  nombreCola: string,
  categoria: string,
  callback: CallbackMensaje
): Promise<string> {
  const conector = obtenerConectorRabbitMQ(nombreServicio);
  
  // Inicializar si no está iniciado
  if (!conector.listenerCount('conectado')) {
    await conector.iniciar();
  }
  
  return await conector.suscribirseAEventos(
    nombreCola,
    [`${categoria}.*`], // Wildcard para todos los eventos de la categoría
    callback
  );
}

/**
 * Suscribe a todos los eventos del sistema
 * 
 * @param {string} nombreServicio - Nombre del servicio que se suscribe
 * @param {string} nombreCola - Nombre de la cola
 * @param {CallbackMensaje} callback - Función a ejecutar cuando llega un mensaje
 * @returns {Promise<string>} - ID único de la suscripción
 */
export async function suscribirseTodosEventos(
  nombreServicio: string,
  nombreCola: string,
  callback: CallbackMensaje
): Promise<string> {
  const conector = obtenerConectorRabbitMQ(nombreServicio);
  
  // Inicializar si no está iniciado
  if (!conector.listenerCount('conectado')) {
    await conector.iniciar();
  }
  
  return await conector.suscribirseAEventos(
    nombreCola,
    ['#'], // Wildcard para todos los eventos
    callback
  );
}

/**
 * Detiene la conexión con RabbitMQ para un servicio
 * 
 * @param {string} nombreServicio - Nombre del servicio
 * @returns {Promise<void>}
 */
export async function detenerRabbitMQ(nombreServicio: string): Promise<void> {
  if (conectores.has(nombreServicio)) {
    const conector = conectores.get(nombreServicio)!;
    await conector.detener();
    conectores.delete(nombreServicio);
    console.log(`[RabbitMQ:${nombreServicio}] Servicio detenido y eliminado`);
  }
}

/**
 * Detiene todas las conexiones con RabbitMQ
 * 
 * @returns {Promise<void>}
 */
export async function detenerTodasLasConexiones(): Promise<void> {
  for (const [nombreServicio, conector] of conectores.entries()) {
    try {
      await conector.detener();
      console.log(`[RabbitMQ:${nombreServicio}] Detenido correctamente`);
    } catch (error) {
      console.error(`[RabbitMQ:${nombreServicio}] Error al detener:`, error);
    }
  }
  
  conectores.clear();
  console.log('[RabbitMQ] Todas las conexiones detenidas');
}

/**
 * Crea un ID de correlación único para seguimiento de mensajes
 * 
 * @returns {string} - ID único
 */
export function crearIdCorrelacion(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Convierte un string a clave de enrutamiento válida para RabbitMQ
 * 
 * @param {string} valor - Valor a convertir
 * @returns {string} - Clave de enrutamiento
 */
export function aClaveEnrutamiento(valor: string): string {
  // Si ya tiene formato de clave de enrutamiento, devolverlo tal cual
  if (valor.includes('.') || valor.includes('*') || valor === '#') {
    return valor;
  }
  
  // Convertir a lowercase y reemplazar espacios con puntos
  return valor.toLowerCase().replace(/\s+/g, '.');
}

/**
 * Verifica si un tipo de evento es válido
 * 
 * @param {string} tipo - Tipo de evento a verificar
 * @returns {boolean} - True si es válido
 */
export function esTipoEventoValido(tipo: string): boolean {
  // Verificar si es un valor de la enumeración TipoEvento
  return Object.values(TipoEvento).includes(tipo as TipoEvento);
}

/**
 * Obtiene la categoría de un tipo de evento
 * 
 * @param {string} tipo - Tipo de evento
 * @returns {string} - Categoría del evento
 */
export function obtenerCategoriaEvento(tipo: string): string {
  // Extraer la categoría (parte antes del primer punto)
  const partes = tipo.split('.');
  return partes.length > 0 ? partes[0] : '';
}

/**
 * Obtiene la acción de un tipo de evento
 * 
 * @param {string} tipo - Tipo de evento
 * @returns {string} - Acción del evento
 */
export function obtenerAccionEvento(tipo: string): string {
  // Extraer la acción (parte después del primer punto)
  const partes = tipo.split('.');
  return partes.length > 1 ? partes.slice(1).join('.') : '';
}

// Exportar la clase y funciones
export default ConectorRabbitMQ; 