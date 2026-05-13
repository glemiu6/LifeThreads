import { Router } from 'express';
import * as NotificationController from '../controllers/notificationController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = Router();

router.get('/',        authGuard, NotificationController.getByUser);
router.put('/status',  authGuard, NotificationController.markAllRead);
router.delete('/:id',  authGuard, NotificationController.deleteNotification);
router.post('/',       authGuard, NotificationController.createNotification);

export default router;