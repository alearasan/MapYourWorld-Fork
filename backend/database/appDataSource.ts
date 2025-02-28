import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { District } from '@backend/map-service/src/models/district.model'; // Importa tus entidades

export const AppDataSource = new DataSource({
    type: 'postgres', // O el tipo de base de datos que uses (mysql, sqlite, etc.)
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mapyourworld13',
    database: 'mapyourworldDB',
    synchronize: true, // Solo para desarrollo, en producción usa migraciones
    logging: true,
    entities: [District], // Aquí van todas tus entidades
    migrations: [],
    subscribers: [],
});

// Inicializar la conexión antes de usarla
AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente');
    })
    .catch((error) => console.error('Error al conectar a la base de datos:', error));