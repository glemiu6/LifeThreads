import { z } from 'zod';

export const updateUserSchema = z.object({
  
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
    email: z.email("Email inválido").optional(),
    bio: z.string().max(255, "A bio não pode exceder 255 caracteres").optional(),
    avatar: z.string("URL do avatar inválido").optional(),
  
});

export const searchUserSchema = z.object({
  query:  z.string().min(1, "O termo de pesquisa é obrigatório"),
});

export const createUserSchema =z.object({
  name:z.string().min(2,"O nome deve ter pelo menos 2 caracteres"),
  email:z.email(),
  password:z.string().min(4,"A password deve ter melo menos 4 caracteres")
  .regex(/[A-Z]/,"Deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/,"Deve conter pelo menos um número")
  .regex(/[^a-zA-Z0-9]/, "Deve conter pelo menos um símbolo"),
  avatar:z.string()
})

export const userIdSchema = z.object({
  id: z.number().int().positive("ID inválido")});