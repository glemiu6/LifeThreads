import { Router } from "express";
import * as userController from '../controllers/userController.js'

const router = Router()

router.get('/',userController.getUsers);
router.post('/',userController.createUserController)
router.get('/search', userController.searchUsers);
router.get('/:id/me', userController.getMe);
router.put('/:id/me', userController.updateMe);
router.post('/:id/follow', userController.followUser);

export default router;
