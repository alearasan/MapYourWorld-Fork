import { Repository } from 'typeorm';
import { District } from '@backend/map-service/src/models/district.model';
import { AppDataSource } from '@backend/database/appDataSource'; // Importa la instancia de conexión

export class DistrictRepository {
    private districtRepo: Repository<District>;

    constructor() {
        this.districtRepo = AppDataSource.getRepository(District);
    }

    async createDistrict(districtData: Omit<District, 'id'>): Promise<District> {
        const district = this.districtRepo.create(districtData);
        return await this.districtRepo.save(district);
    }
}
