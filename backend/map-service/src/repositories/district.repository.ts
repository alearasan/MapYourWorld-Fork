import { Repository } from 'typeorm';
import { District } from '../models/district.model'; // Importa tu entidad
import { AppDataSource } from '../../../database/appDataSource'; // Importa la instancia de conexión
import { Map } from '../models/map.model';

export default class DistrictRepository {
    private districtRepo: Repository<District>;
    private mapRepo: Repository<Map>;


    constructor() {
        this.districtRepo = AppDataSource.getRepository(District);
        this.mapRepo = AppDataSource.getRepository(Map);
    }

    async createDistrict(districtData: Omit<District, 'id'>): Promise<void> {
        await this.districtRepo.save(districtData);
    }

    async getDistrictById(districtId: string): Promise<District> {
        const district = await this.districtRepo.findOneBy({ id: districtId });
        if (!district) {
            throw new Error(`District with id ${districtId} not found`);
        }
        return district;
    }

    async getDistricts(): Promise<District[]> {
        return await this.districtRepo.find();
    }

    async updateDistrict(districtId: string, districtData: Partial<District>): Promise<District> {
        const district = await this.getDistrictById(districtId);
        Object.assign(district, districtData);
        return await this.districtRepo.save(district);
    }

    async unlockDistrict(districtId: string): Promise<District> {
        const district = await this.getDistrictById(districtId);
        district.isUnlocked = true;
        return await this.districtRepo.save(district);
    }

    async getDistrictsUnlocked(): Promise<District[]> {
        return await this.districtRepo.find({ where: { isUnlocked: true } });
    }

    async findDistrictContainingLocation(latitude: number, longitude: number): Promise<District | null> {
        const result = await this.districtRepo.query(`
            SELECT * 
            FROM district 
            WHERE ST_Within(ST_SetSRID(ST_MakePoint($1, $2), 4326), boundaries)
            LIMIT 1
        `, [longitude, latitude]);

        return result;
    }

    async getDistrictsByMapId(mapId: string): Promise<District[]> {
        console.log(`Buscando distritos para el mapa con ID ${mapId}`);
        const districts = await this.districtRepo.find({
            where: { map: { id: mapId } },
            relations: ['user', 'map']
        });
        console.log(`Se encontraron ${districts.length} distritos para el mapa ${mapId}`);
        return districts;
    }
}
