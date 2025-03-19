import { Router } from 'express';
import * as userAchievementController from '../controllers/userAchievement.controller';

const router: Router = Router();


/**
 * Crea un nuevo usuario-logro (desbloquea un logro para un usuario)
 * POST /user-achievements
 */
router.post('/user-achievements', userAchievementController.createAchievement);

/**
 * Obtiene todos los logros (UserAchievement) obtenidos por un usuario.
 * GET /user-achievements/user/:userId
 */
router.get('/user-achievements/user/:userId', userAchievementController.getAchievementsByUser);

/**
 * Obtiene todos los usuarios que han desbloqueado un logro específico.
 * GET /user-achievements/achievement/:achievementId
 */
router.get('/user-achievements/achievement/:achievementId', userAchievementController.getUsersByAchievement);


export default router;
