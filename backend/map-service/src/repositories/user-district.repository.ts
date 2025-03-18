import { Repository } from 'typeorm';
import { AppDataSource } from '../../../database/appDataSource';
import { UserDistrict } from '../models/user-district.model';

export class UserDistrictRepository {
    private repo: Repository<UserDistrict>;

    constructor() {
        this.repo = AppDataSource.getRepository(UserDistrict);
    }

    async createUserDistrict(userDistrictData: Omit<UserDistrict, 'id'>): Promise<UserDistrict> {
            const userDistrict = this.repo.create(userDistrictData);

            this.repo.createQueryBuilder("userDistrict")
            return await this.repo.save(userDistrict);
    }

   
    
  
    
}