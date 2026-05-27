// mediaController.ts
import { z } from 'zod';

export const mediaSchema = z.object({
  url: z.string().url(),
  type: z.string().min(1) 
                           
});