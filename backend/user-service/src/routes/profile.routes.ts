import { Router } from 'express';
import {
  getProfile,
  getPublicProfile,
  updateProfile,
  updateAvatar,
  updatePreferences,
  searchProfiles,
  deactivateAccount,
  reactivateAccount,
} from '../controllers/profile.controller';

const router: Router = Router();

router.get('/:userId', getProfile);

router.get('/:userId/public', getPublicProfile);

router.put('/:userId', updateProfile);

router.put('/:userId/avatar', updateAvatar);

router.put('/:userId/preferences', updatePreferences);

router.get('/', searchProfiles);

router.post('/:userId/deactivate', deactivateAccount);

router.post('/:userId/reactivate', reactivateAccount);

export default router;
