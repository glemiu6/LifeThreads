import { type Response } from 'express';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';
import * as NotificationService from '../services/notificationService.js';
import { NotificationIdSchema, CreateNotificationSchema } from '../schema/notificationSchema.js';

export const getByUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id; 
  const data = await NotificationService.getAllByUser(userId);
  res.status(200).json(data);
};

export const markAllRead = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  await NotificationService.markAllRead(userId);
  res.status(204).send();
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  const id = NotificationIdSchema.safeParse(Number(req.params.id));
  if (!id.success)
    return res.status(400).json({ error: id.error.issues.map(i => `${i.path}: ${i.message}`) });
  await NotificationService.deleteNotification(id.data);
  res.status(204).send();
};

export const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  const result = CreateNotificationSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });
  const created = await NotificationService.createNotification(result.data.userId, result.data.type);
  res.status(201).json(created);
};