import { createDistrict } from "@backend/map-service/src/services/district.service";
import { AppDataSource } from '@backend/database/appDataSource';
import { Geometry } from 'geojson';



AppDataSource.initialize().then(() => {
    console.log('Conexión a la base de datos establecida');
}).catch(error => console.log('Error de conexión a la base de datos:', error));




const districtData = {
    name: 'Distrito Sur',
    description: 'Un distrito ubicado en el sur de la ciudad, conocido por sus parques y áreas recreativas.',
    boundaries: {
        type: 'Polygon',
        coordinates: [
            [
                [-73.935242, 40.730610], // Coordenadas al azar para formar un polígono
                [-73.935242, 40.740610],
                [-73.925242, 40.740610],
                [-73.925242, 40.730610],
                [-73.935242, 40.730610], // Cerrando el polígono
            ],
        ],
    } as Geometry, // Definiendo el tipo Geometry de las coordenadas
    isUnlocked: true,
};
const userId = 'some-admin-user-id'; // Usa un id de usuario que tenga permisos de administrador




async function testCreateDistrict() {
    try {
        await AppDataSource.initialize(); // Asegúrate de inicializar la conexión
        const result = await createDistrict(districtData, userId);
        console.log('Distrito creado correctamente:', result);
    } catch (error) {
        console.error('Error al crear el distrito:', error);
    }
}

testCreateDistrict();