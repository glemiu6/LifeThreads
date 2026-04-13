import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { NotificationIdSchema, UpdateNotificationSchema } from "../schemas/notification.schema";

export class NotificationController {
  static async getByUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const data = await NotificationService.getAllByUser(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao procurar notificações" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = NotificationIdSchema.parse(req.params);
      const { is_read } = UpdateNotificationSchema.parse(req.body);
      const updated = await NotificationService.updateReadStatus(id, is_read);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  }
}
