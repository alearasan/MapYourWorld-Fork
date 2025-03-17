import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/appDataSource'; // Importa la instancia de conexión
import { UserAchievement } from '../models/userAchievement.model';

export default class userAchievementRepository {
    private userAchievementRepo: Repository<UserAchievement>;

    constructor() {
        this.userAchievementRepo = AppDataSource.getRepository(UserAchievement);
    }

}
