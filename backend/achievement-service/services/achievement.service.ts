/**
 * Servicio de mapas
 * Gestiona la creación, consulta y desbloqueo de mapas del mapa
 */

//import { publishEvent } from '@shared/libs/rabbitmq';
import {Achievement} from '../models/achievement.model';
import AchievementRepository from '../repositories/achievement.repository';


const repo = new AchievementRepository().achievementRepo;

/**
 * Crea un nuevo logro
 * @param AchievementData Datos del logro a crear
 */

//crear logro
export const createAchievement = async (
  AchievementData: Omit<Achievement, 'id'>,
): Promise<Achievement> => {

  try {
    if (!AchievementData.name || !AchievementData.description || !AchievementData.points || !AchievementData.iconUrl) {
      throw new Error("No pueden faltar datos de logro.")
    }
    const newAchievement = repo.create(AchievementData);

    console.log("logro creado correctamente:", newAchievement);
    return newAchievement;

  } catch (error) {
    throw new Error("Error al crear el logro");
  }
};

//obtener todos los logros
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievements = await repo.find();
    return achievements;
  } catch (error) {
    throw new Error("Error al obtener los logros");
  }
};

//obtener logro por nombre
export const getAchievementByName = async (name: string): Promise<Achievement | null> => {
  try {
    const achievement = await repo.findOne({ where: { name } });
    return achievement;
  } catch (error) {
    throw new Error("Error al obtener logro por nombre");
  }
};