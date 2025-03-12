import { createDistrict } from "../services/district.service";
import { AppDataSource } from '../../../database/appDataSource';
import { Geometry } from 'geojson';
import * as fs from 'fs';
import { District } from "../models/district.model";

const filePath = 'database/map.geojson';
const rawData = fs.readFileSync(filePath, 'utf-8');
const geojsonData = JSON.parse(rawData);


const user_map_Id = 'some-admin-user-id'; // Usa un ID de usuario con permisos de administrador
const districtsData = geojsonData.features.map((feature: any, index: number) => ({
    name: `Distrito ${index + 1}`, // Asigna un nombre genérico si no hay "properties"
    description: 'Descripción genérica del distrito.', // Se puede personalizar
    boundaries: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates
    } as Geometry,
    isUnlocked: false,
    map: null,
    user: null
}));


export async function createAllDistricts() {
    try {
        if (!AppDataSource.isInitialized) {
            console.log("🔄 Inicializando la base de datos...");
            await AppDataSource.initialize();
            console.log("✅ Base de datos inicializada.");
        }

        const existingDistricts = await AppDataSource.getRepository(District).count();
        if (existingDistricts > 0) {
            console.log("⚠️ Los distritos ya están en la base de datos. No se insertarán duplicados.");
            return;
        }

        //for (const districtData of districtsData) {
        await createDistrict();
        //     console.log(`✅ Distrito creado: ${districtData.name}`, result);
        // }
    } catch (error) {
        console.error("❌ Error al crear los distritos:", error);
    }
}

