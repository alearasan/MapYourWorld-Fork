import { Router } from 'express';
import { createFriendController, listFriendsController, findFriendByIdController, listSearchUserController, updateFriendStatusController, getFriendsController } from '../controllers/friend.controller';

const router: Router = Router();

router.post('/create', createFriendController);

router.get('/search/:nameData', listSearchUserController);

router.get('/:friendId', findFriendByIdController);

router.put('/update/:friendId/:status', updateFriendStatusController);

router.get('/list/:status/:userId', listFriendsController);

router.get('/friends/:userId', getFriendsController);

export default router;