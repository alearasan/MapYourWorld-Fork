import { Router } from 'express';
import * as UserStatController from '../controllers/userStat.controller';

const router: Router = Router();

router.get('/:id', UserStatController.getAllStatsByUser);

export default router;