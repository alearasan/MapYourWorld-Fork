import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { District } from '@backend/map-service/src/models/district.model'; // Importa tus entidades
import { UserProfile } from '@backend/user-service/src/models/userProfile.model';
import { User } from '@backend/auth-service/src/models/user.model'; 


export const AppDataSource = new DataSource({
    type: 'postgres', // O el tipo de base de datos que uses (mysql, sqlite, etc.)
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mapyourworld13',
    database: 'mapyourworldDB',
    synchronize: true, // Solo para desarrollo, en producción usa migraciones
    logging: true,
    entities: [District, UserProfile], // Aquí van todas tus entidades
    migrations: [],
    subscribers: [],
    extra: {
        connectionTimeoutMillis: 30000, // 30s de espera para conectar
        query_timeout: 60000, // 60s de espera para consultas
    }
});

// Inicializar la conexión antes de usarla
AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente');
    })
    .catch((error) => console.error('Error al conectar a la base de datos:', error));