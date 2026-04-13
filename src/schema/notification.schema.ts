import { z } from "zod";

export const NotificationIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()),
});

export const UpdateNotificationSchema = z.object({
  is_read: z.boolean(),
});
