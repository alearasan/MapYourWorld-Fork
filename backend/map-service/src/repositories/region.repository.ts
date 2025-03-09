import { Repository } from 'typeorm';
import { AppDataSource } from '@backend/database/appDataSource';
import { Region } from '@backend/map-service/src/models/region.model';

export default class RegionRepository {
    private regionRepo: Repository<Region>;

    constructor() {
        this.regionRepo = AppDataSource.getRepository(Region);
    }

    async saveRegion(name: string, description: string): Promise<Region> {
        const region = this.regionRepo.create({
            name,description
        });
        return await this.regionRepo.save(region);
    }

    async getRegion(name: string): Promise<Region[]> {
        return await this.regionRepo.find({
            where: { name }
        });
    }
}