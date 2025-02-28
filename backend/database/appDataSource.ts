import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { District } from '@backend/map-service/src/models/district.model'; // Importa tus entidades

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "mapyourworld13",
    database: "mapyourworldDB",
    synchronize: true,
    logging: false,
    entities: [District],
    migrations: [__dirname + "/../migrations/*.ts"],
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