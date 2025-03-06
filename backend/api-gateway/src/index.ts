/**
 * API Gateway para MapYourWorld
 * Punto central de entrada a todos los microservicios
 */

import express, { Request, Response, NextFunction } from 'express';
import { Express } from 'express';
import helmet from 'helmet';
// @ts-ignore
import compression from 'compression';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from './routes';
import { setupCircuitBreakers } from './middleware/circuit-breaker';
import { setupCache } from './middleware/cache';
import { setupMetrics } from './middleware/metrics';
import fs from 'fs';
import path from 'path';
import http from 'http';
import notificacionesController from './controllers/notificaciones-controller';
import { inicializarRabbitMQ, detenerRabbitMQ } from './models/rabbit-mq';
import { eventHandlerService } from './services/event-handler.service';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import chalk from 'chalk';
import { WebSocketServer } from 'ws';

// Cargar variables de entorno
dotenv.config();

// Inicializar app Express
const app: Express = express();
const PORT = process.env.PORT || 3000;
const NOMBRE_SERVICIO = 'api-gateway';

// Crear servidor HTTP para poder montar WebSockets
const server = http.createServer(app);

// Middlewares de seguridad y utilidad
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Configurar rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // límite de 500 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas peticiones, por favor intente más tarde'
});
app.use(limiter);

// Configurar logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/api-gateway-error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/api-gateway.log') 
    })
  ]
});

// Logger para peticiones HTTP
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: true,
  colorize: true
}));

// Configurar circuit breakers para tolerancia a fallos
setupCircuitBreakers();

// Configurar caché para mejorar rendimiento
setupCache(app);

// Configurar métricas
setupMetrics(app);

// Montar rutas de la API
app.use('/api', router);

// Documentación de la API
if (fs.existsSync(path.join(__dirname, '../swagger.json'))) {
  const swaggerDocument = require('../swagger.json');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info('Documentación Swagger disponible en /api/docs');
}

// Interfaz personalizada para errores de la API
interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Manejador de errores global
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    code: err.code || 'UNKNOWN_ERROR'
  });

  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message,
      code: err.code || 'INTERNAL_SERVER_ERROR'
    }
  });
});

// Crear WebSocket Server para notificaciones en tiempo real
const wss = new WebSocketServer({ server });

// Inicializar RabbitMQ y gestión de eventos
async function initializeRabbitMQ() {
  try {
    const rabbitMQHost = process.env.RABBITMQ_HOST || 'localhost';
    const rabbitMQPort = process.env.RABBITMQ_PORT || '5672';
    
    // Configurar reintentos en base a variables de entorno
    const maxRetries = parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || '5', 10);
    const retryDelay = parseInt(process.env.RABBITMQ_RETRY_DELAY || '2000', 10);
    
    logger.info(`Iniciando conexión a RabbitMQ en ${rabbitMQHost}:${rabbitMQPort}...`);
    console.log(chalk.yellow(`Iniciando conexión a RabbitMQ en ${rabbitMQHost}:${rabbitMQPort}...`));
    
    // Inicializar RabbitMQ con la configuración de variables de entorno
    await inicializarRabbitMQ(NOMBRE_SERVICIO);
    
    // Inicializar servicio de eventos
    await eventHandlerService.iniciar();
    
    logger.info('RabbitMQ inicializado correctamente');
    console.log(chalk.green('RabbitMQ inicializado correctamente ✅'));
    
    return { rabbitMQConnector: true, eventHandlerService };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Error al iniciar RabbitMQ: ${errorMsg}`);
    console.error(chalk.red(`Error al iniciar RabbitMQ: ${errorMsg}`));
    
    // Si estamos en modo de desarrollo o este script es parte de un arranque coordinado
    // continuamos sin RabbitMQ para permitir desarrollo parcial
    if (process.env.NODE_ENV === 'development' || process.env.UNIFIED_START === 'true') {
      logger.warn('Continuando sin RabbitMQ en modo desarrollo. La funcionalidad de eventos no estará disponible.');
      console.warn(chalk.yellow('⚠️ Continuando sin RabbitMQ en modo desarrollo. La funcionalidad de eventos no estará disponible.'));
      return { rabbitMQConnector: null, eventHandlerService: null };
    } else {
      // En producción, consideramos esto un error fatal
      throw error;
    }
  }
}

// Iniciar el servidor
server.listen(PORT, async () => {
  console.log(chalk.green(`✅ API Gateway ejecutándose en http://localhost:${PORT}`));
  logger.info(`API Gateway ejecutándose en http://localhost:${PORT}`);
  
  try {
    // Iniciar RabbitMQ con manejo de errores
    const { rabbitMQConnector, eventHandlerService } = await initializeRabbitMQ();
    
    // Guardar referencias en app para uso en otras partes
    app.locals.rabbitMQ = rabbitMQConnector;
    app.locals.eventHandler = eventHandlerService;
    
    // Inicializar controlador de notificaciones en tiempo real
    await notificacionesController.iniciar(server);
    
    // WebSocket, configuración básica
    wss.on('connection', (ws) => {
      console.log(chalk.blue('Nueva conexión WebSocket establecida'));
      logger.info('Nueva conexión WebSocket establecida');
      
      ws.on('message', (message) => {
        console.log(chalk.blue(`Mensaje recibido: ${message}`));
        logger.info(`Mensaje WebSocket recibido: ${message}`);
      });
      
      ws.on('close', () => {
        console.log(chalk.blue('Conexión WebSocket cerrada'));
        logger.info('Conexión WebSocket cerrada');
      });
    });
    
    // Loguear que el sistema completo está disponible
    console.log(chalk.green.bold('Sistema completo disponible'));
    logger.info('Sistema completo disponible');
    
  } catch (error) {
    // Loguear el error pero no detener el servidor
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error en la inicialización completa: ${errorMsg}`));
    logger.error(`Error en la inicialización completa: ${errorMsg}`);
    
    // Indicar que estamos en modo degradado (sin eventos)
    console.warn(chalk.yellow('⚠️ API Gateway funcionando en modo degradado (sin eventos)'));
    logger.warn('API Gateway funcionando en modo degradado (sin eventos)');
  }
});

// Manejo de señales para cierre limpio
process.on('SIGINT', async () => {
  logger.info('Recibida señal SIGINT (Ctrl+C)');
  console.log(chalk.yellow('Recibida señal SIGINT (Ctrl+C), cerrando conexiones...'));
  
  // Detener controlador de notificaciones
  try {
    await notificacionesController.detener();
    console.log(chalk.green('Controlador de notificaciones detenido correctamente'));
  } catch (error) {
    console.error(chalk.red(`Error al detener controlador de notificaciones: ${error}`));
  }
  
  // Detener servicio de eventos
  if (app.locals.eventHandler) {
    console.log(chalk.yellow('Deteniendo servicio de eventos...'));
    try {
      await app.locals.eventHandler.detener();
      console.log(chalk.green('Servicio de eventos detenido correctamente'));
    } catch (error) {
      console.error(chalk.red(`Error al detener servicio de eventos: ${error}`));
    }
  }
  
  // Detener RabbitMQ
  try {
    await detenerRabbitMQ(NOMBRE_SERVICIO);
    console.log(chalk.green('Conexión con RabbitMQ cerrada correctamente'));
  } catch (error) {
    console.error(chalk.red(`Error al cerrar conexión con RabbitMQ: ${error}`));
  }
  
  // Cerrar el servidor HTTP
  server.close(() => {
    console.log(chalk.green('Servidor HTTP cerrado correctamente'));
    process.exit(0);
  });
  
  // Forzar cierre después de 5 segundos si algo bloquea
  setTimeout(() => {
    console.log(chalk.red('Forzando cierre después de timeout'));
    process.exit(1);
  }, 5000);
});

// Exportar app para testing
export default app; 