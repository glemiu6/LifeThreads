import { z } from "zod";

export const NotificationIdSchema = z.coerce.number().int().positive()

export const UpdateNotificationSchema = z.object({
  is_read: z.boolean(),
});
