import { Router } from "express";
import * as NotificationController from "../controllers/notificationController.js";
import { authGuard } from '../middleware/authGuard.js';

const router = Router();
router.put('/read-all', authGuard, NotificationController.markAllRead);
router.post("/", NotificationController.createNotification);
router.delete("/:id", NotificationController.deleteNotification);
router.put("/:id", NotificationController.updateStatus);
router.get("/user/:userId", NotificationController.getByUser);


export default router;
