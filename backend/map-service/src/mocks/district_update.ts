import { updateDistrict } from "@backend/map-service/src/services/district.service";
import { AppDataSource } from '@backend/database/appDataSource';
import { Geometry } from 'geojson';

AppDataSource.initialize().then(() => {
    console.log('Conexión a la base de datos establecida');
}).catch(error => console.log('Error de conexión a la base de datos:', error));

const districtId = '2b13fa10-0868-4a49-ba2d-79b672584eb5'; // ID del distrito que deseas actualizar

const updateData = {
    name: 'Distrito Sur Modificado por 2',
    description: 'Descripción actualizada para el distrito sur.',
    boundaries: {
        type: 'Polygon',
        coordinates: [
            [
                [-73.935242, 40.730610],
                [-73.935242, 40.740610],
                [-73.925242, 40.740610],
                [-73.925242, 40.730610],
                [-73.935242, 40.730610], // Cerrando el polígono
            ],
        ],
    } as Geometry,
    isUnlocked: false,
};


async function testUpdateDistrict() {
    try {
        await AppDataSource.initialize(); // Inicializa la conexión si aún no se ha hecho
        const result = await updateDistrict(districtId, updateData);
        console.log('Distrito actualizado correctamente:', result);
    } catch (error) {
        console.error('Error al actualizar el distrito:', error);
    }
}

testUpdateDistrict();
