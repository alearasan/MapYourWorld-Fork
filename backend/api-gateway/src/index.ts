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

// Cargar variables de entorno
dotenv.config();

// Inicializar app Express
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad y utilidad
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas solicitudes, por favor intente más tarde'
  }
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
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Middleware de logging para solicitudes
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false
}));

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configurar métricas de rendimiento
setupMetrics(app);

// Configurar circuit breakers
setupCircuitBreakers();

// Configurar caché
setupCache(app);

// Configurar rutas
app.use('/api', router);

// Middleware de logging para errores
app.use(expressWinston.errorLogger({
  winstonInstance: logger
}));

// Interfaz de error personalizada
interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Manejador global de errores
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Error interno del servidor',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
  logger.info(`✅ API Gateway ejecutándose en el puerto ${PORT}`);
  logger.info(`🔍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Excepción no capturada', { error: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Promesa rechazada no manejada', { 
    reason, 
    promise 
  });
});

export default app; 