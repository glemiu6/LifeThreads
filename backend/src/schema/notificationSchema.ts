import { z } from "zod";

export const NotificationIdSchema = z.coerce.number().int().positive()

export const UpdateNotificationSchema = z.object({
  is_read: z.boolean(),
});

export const CreateNotificationSchema = z.object({
  userId: z.coerce.number().int().positive(),
  type: z.enum(['INVITE', 'COMMENT', 'REACT', 'FOLLOW'])
})