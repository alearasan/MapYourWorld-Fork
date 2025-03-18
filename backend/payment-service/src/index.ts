/**
 * Servicio de Payment
 * Gestiona la creación, obtención, actualización y eliminación de pagos
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import paymentRouter from './routes/payment.routes';

// Dummy RabbitMQ connect function para desarrollo (opcional)
const connectRabbitMQ = async () => {
  console.log('[DUMMY] Conectando a RabbitMQ de forma simulada...');
  return true;
};

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/payments', paymentRouter);

// Ruta de salud para verificar que el servicio está funcionando
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'payment-service',
    status: 'operational',
    version: '1.0.0'
  });
});

// Iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a RabbitMQ (simulado)
    await connectRabbitMQ();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servicio de pagos ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servicio de pagos:', error);
    process.exit(1);
  }
};

startServer();
