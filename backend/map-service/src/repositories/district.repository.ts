import { Repository } from 'typeorm';
import { District } from '@backend/map-service/src/models/district.model';
import { AppDataSource } from '@backend/database/appDataSource'; // Importa la instancia de conexión

export default class DistrictRepository {
    private districtRepo: Repository<District>;

    constructor() {
        this.districtRepo = AppDataSource.getRepository(District);
    }

    async createDistrict(districtData: Omit<District, 'id'>): Promise<District> {
        const district = this.districtRepo.create(districtData);
        return await this.districtRepo.save(district);
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
}
