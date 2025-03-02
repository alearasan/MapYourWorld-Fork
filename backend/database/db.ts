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
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    DROP TABLE IF EXISTS district;

    CREATE TABLE IF NOT EXISTS district (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      boundaries GEOMETRY(Polygon, 4326),  -- Usando tipo GEOMETRY para almacenar polígonos
      center GEOMETRY(Point, 4326),  -- Usando tipo GEOMETRY para almacenar el punto central
      isBlocked BOOLEAN DEFAULT FALSE  -- Booleano para marcar si está bloqueado
    );

  `)
  .then(() => {
    console.log('Tablas creadas satisfactoriamente');
  })
  .catch((error) => {
    console.error('Error al crear la tabla:', error);
  });


  export default db