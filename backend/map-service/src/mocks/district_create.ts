import { createDistrict } from "../services/district.service";
import { AppDataSource } from '../../../database/appDataSource';
import { Geometry } from 'geojson';
import * as fs from 'fs';

const filePath = 'database/map.geojson';
const rawData = fs.readFileSync(filePath, 'utf-8');
const geojsonData = JSON.parse(rawData);

const userId = 'some-admin-user-id'; // Usa un ID de usuario con permisos de administrador

const districtsData = geojsonData.features.map((feature: any, index: number) => ({
    name: `Distrito ${index + 1}`, // Asigna un nombre genérico si no hay "properties"
    description: 'Descripción genérica del distrito.', // Se puede personalizar
    boundaries: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates
    } as Geometry,
    isUnlocked: false,
}));

export async function createAllDistricts() {
    try {
        // Inicializar la base de datos si no está inicializada
        if (!AppDataSource.isInitialized) {
            console.log("🔄 Inicializando la base de datos...");
            await AppDataSource.initialize();
            console.log("✅ Base de datos inicializada.");
        }

        for (const districtData of districtsData) {
            const result = await createDistrict(districtData, userId);
            console.log(`Distrito creado correctamente: ${districtData.name}`, result);
        }
    } catch (error) {
        console.error('Error al crear los distritos:', error);
    }
}

createAllDistricts();