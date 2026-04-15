import { Router } from "express";
import * as userController from '../controllers/userController.js'

const router = Router()

// ---- auth routes ----
router.post('/auth/register', userController.createUserController);

// ---- static routes ----
router.get('/search', userController.searchUsers);

// ---- collection routes ----
router.get('/', userController.getUsers);

// ---- me routes (temporary until auth is added) ----
router.get('/:id/me', userController.getMe);
router.put('/:id/me', userController.updateMe);
router.delete('/:id/me', userController.deleteMe);

// ---- dynamic routes ----
router.get('/:id/profile', userController.getPublicProfile);
router.get('/:id/following', userController.getFollowing);
router.get('/:id/followers', userController.getFollowers);
router.post('/:id/follow', userController.followUser);
router.delete('/:id/follow', userController.unfollowUser);

export default router;