import { Repository } from 'typeorm';
import { Achievement } from '../models/achievement.model'; // Importa tu entidad
import { AppDataSource } from '../../database/appDataSource'; // Importa la instancia de conexión

export default class AchievementRepository {
    public achievementRepo: Repository<Achievement>;


    constructor() {
        this.achievementRepo = AppDataSource.getRepository(Achievement);
    }
    //no se implementna métodos adicionales ya que con los básicos de typeorm es suficiente
    //se deja esta clase como punto de extensión
}
