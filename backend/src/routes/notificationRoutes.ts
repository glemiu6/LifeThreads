import { Router } from "express";
import * as NotificationController from "../controllers/notificationController.js";

const router = Router();


router.get("/user/:userId", NotificationController.getByUser);


router.put("/:id", NotificationController.updateStatus);

router.post("/", NotificationController.createNotification);

export default router;
