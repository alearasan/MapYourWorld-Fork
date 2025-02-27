import pgPromise from 'pg-promise';

const db = pgPromise()({
  host: 'localhost',  // Host de la base de datos
  port: 5432,         // Puerto
  user: 'postgres',   // Usuario
  password: 'mapyourworld13',  // Contraseña
  database: 'mapyourworldDB',    // Nombre de la base de datos
  ssl: false,  // Desactivar SSL si no es necesario
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