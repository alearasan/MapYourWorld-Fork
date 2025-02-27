import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const db = pgPromise()({
  host: process.env.DB_HOST || 'localhost' ,     // Usar las variables de entorno
  port: Number(process.env.DB_PORT) || 5432,     // Usar las variables de entorno
  user: process.env.DB_USER || 'postgres',     // Usar las variables de entorno
  password: process.env.DB_PASSWORD || 'mapyourworld13', // Usar las variables de entorno
  database: process.env.DB_NAME || 'mapyourworldDB', // Usar las variables de entorno
  ssl: false,                    // Desactivar SSL si no es necesario
});


db.none(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
  .then(() => {
    console.log('Tabla de usuarios creada exitosamente');
  })
  .catch((error) => {
    console.error('Error al crear la tabla:', error);
  });