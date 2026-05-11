import { Router } from "express";
import * as userController from '../controllers/userController.js'
import { authGuard } from '../middleware/authGuard.js'
import * as AuthController from '../controllers/authController.js'

const router = Router();

router.post('/auth/register', userController.createUserController);
router.post('/auth/login', AuthController.login);

router.get('/search', userController.searchUsers);
router.get('/:id/profile', userController.getPublicProfile);

router.get('/', authGuard, userController.getUsers);

router.get('/:id', authGuard, userController.getMe);
router.put('/:id', authGuard, userController.updateMe);       
router.delete('/:id', authGuard, userController.deleteMe);    

router.get('/:id/following', authGuard, userController.getFollowing);
router.get('/:id/followers', authGuard, userController.getFollowers);
router.post('/:id/follow', authGuard, userController.followUser);
router.delete('/:id/follow', authGuard, userController.unfollowUser);

export default router;
