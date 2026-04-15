import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
    email: z.string().email("Email inválido").optional(),
    bio: z.string().max(255, "A bio não pode exceder 255 caracteres").optional(),
    avatar: z.string().url("URL do avatar inválido").optional(),
  }),
});

export const searchUserSchema = z.object({
  query: z.object({
    q: z.string().min(1, "O termo de pesquisa é obrigatório"),
  }),
});