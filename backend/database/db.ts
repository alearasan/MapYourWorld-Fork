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

    DROP TABLE IF EXISTS district;

    CREATE TABLE IF NOT EXISTS district (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      boundaries GEOMETRY(Polygon, 4326),  -- Usando tipo GEOMETRY para almacenar polígonos
      center GEOMETRY(Point, 4326),  -- Usando tipo GEOMETRY para almacenar el punto central
      isBlocked BOOLEAN DEFAULT FALSE  -- Booleano para marcar si está bloqueado
    );

    CREATE TABLE IF NOT EXISTS user_locations (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      location GEOMETRY(Point, 4326) NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Índice espacial para consultas geográficas rápidas
    CREATE INDEX IF NOT EXISTS idx_user_locations_gist ON user_locations USING GIST(location);

  `)
  .then(() => {
    console.log('Tablas creadas satisfactoriamente');
  })
  .catch((error) => {
    console.error('Error al crear la tabla:', error);
  });

// En backend/map-service/src/index.ts (o donde inicies tu servicio)
// Verificar configuración de PostGIS
db.any(`SELECT PostGIS_version();`)
  .then(() => {
    console.log('✅ PostGIS está instalado y funcionando');
    
    // Verificar tabla de ubicaciones
    return db.any(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_locations'
      );`
    );
  })
  .then(result => {
    if (result[0].exists) {
      console.log('✅ Tabla user_locations existe');
    } else {
      console.error('❌ Tabla user_locations NO existe');
    }
  })
  .catch(error => {
    console.error('❌ Error verificando PostGIS:', error);
  });

export default db