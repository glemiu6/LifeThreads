import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as AuthController from '../controllers/authController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/register',   userController.createUserController);
router.post('/auth/login',      AuthController.login);

// ── Static ────────────────────────────────────────────────────────────────────
router.get('/search',           userController.searchUsers);

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',                 authGuard, userController.getUsers);

// ── Single user ───────────────────────────────────────────────────────────────
router.get('/:id',              authGuard, userController.getMe);
router.put('/:id',              authGuard, userController.updateMe);
router.delete('/:id',           authGuard, userController.deleteMe);
router.get('/:id/profile',      userController.getPublicProfile);

// ── Social ────────────────────────────────────────────────────────────────────
router.get('/:id/following',    authGuard, userController.getFollowing);
router.get('/:id/followers',    authGuard, userController.getFollowers);
router.post('/:id/follow',      authGuard, userController.followUser);
router.delete('/:id/follow',    authGuard, userController.unfollowUser);

export default router;