/**
 * Configuración de la conexión a la base de datos MongoDB
 * para el servicio de autenticación
 */

import mongoose from 'mongoose';

// Variables de entorno para la conexión
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'mapyourworld_auth';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';

// URI de conexión
const DB_URI = DB_USER && DB_PASS
  ? `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Opciones de conexión
const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

/**
 * Establece la conexión con MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URI, DB_OPTIONS);
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    throw error;
  }
};

/**
 * Cierra la conexión a la base de datos
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión a MongoDB:', error);
    throw error;
  }
}; 