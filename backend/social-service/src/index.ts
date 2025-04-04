/**
 * Servicio Social de MapYourWorld
 * Gestiona comentarios, likes, fotos y seguimiento entre usuarios
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import photoRouter from './routes/photo.routes';

// Dummy RabbitMQ connect function for development
const connectRabbitMQ = async () => {
  console.log('[DUMMY] Conectando a RabbitMQ de forma simulada...');
  return true;
};

// Cargar variables de entorno
dotenv.config();

// Inicializar la app Express
const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' })); // Aumentar límite para subida de imágenes
app.use(express.urlencoded({ extended: true }));

app.use('/api/photos', photoRouter);

// Ruta de salud para verificar que el servicio está funcionando
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'social-service',
    status: 'operational',
    version: '1.0.0'
  });
});

// Iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a RabbitMQ
    await connectRabbitMQ();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servicio social ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servicio social:', error);
    process.exit(1);
  }
};

startServer(); 

export default app;