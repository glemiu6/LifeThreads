import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

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

/**
 * @swagger
 * /api/notifications/{id}:
 * put:
 * summary: Atualiza estado da notificação
 * tags: [Notifications]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 */
router.put("/:id", NotificationController.updateStatus);

export default router;
