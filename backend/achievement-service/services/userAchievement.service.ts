/**
 * Servicio de mapas
 * Gestiona la creación, consulta y desbloqueo de mapas del mapa
 */

//import { publishEvent } from '@shared/libs/rabbitmq';
import {UserAchievement} from '../models/userAchievement.model';
import UserAchievementRepository from '../repositories/userAchievement.repository';

const repo = new UserAchievementRepository().userAchievementRepo;

/**
 * Crea un nuevo logro
 * @param UserAchievementData Datos de la entrada usuario-logro a crear
 */

//crear logro
export const createUserAchievement = async (
  UserAchievementData: Omit<UserAchievement, 'id'>,
): Promise<UserAchievement> => {
  try {
    if (!UserAchievementData.user || !UserAchievementData.achievement || !UserAchievementData.dateEarned) {
      throw new Error("No pueden faltar datos de user-achievement.")
    }
    const newUserAchievement = repo.create(UserAchievementData);

    console.log("uusario-logro creado correctamente:", newUserAchievement);
    return newUserAchievement;

  } catch (error) {
    throw new Error("Error al crear el usuario-logro");
  }
};

//obtener todos los logros
export const getAchievements = async (): Promise<UserAchievement[]> => {
  try {
    const achievements = await repo.find();
    return achievements;
  } catch (error) {
    throw new Error("Error al obtener los logros");
  }
};

//obtener todos los logros de un usuario

export const getAchievementByUser = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const userAchievements = await repo.find({ where: { user: { id: userId } }
    });
    return userAchievements;
  } catch (error) {
    throw new Error("Error al obtener los logros del usuario");
  }
};

//obtener todos usuarios que consiguieron un logro
export const getUsersByAchievement = async (achievementId: string): Promise<UserAchievement[]> => {
  try {
    const userAchievements = await repo.find({ where: { achievement: { id: achievementId } }
    });
    return userAchievements;
  } catch (error) {
    throw new Error("Error al obtener los logros del usuario");
  }
};