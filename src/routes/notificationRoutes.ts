import { Router } from "express";
import * as NotificationController from "../controllers/notificationController.js";

const router = Router();

/**
 * @swagger
 * /api/notifications/user/{userId}:
 * get:
 * summary: Lista notificações de um utilizador
 * tags: [Notifications]
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: integer
 */
router.get("/user/:userId", NotificationController.getByUser);


router.put("/:id", NotificationController.updateStatus);

export default router;
