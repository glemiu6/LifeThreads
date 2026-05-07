import { z } from 'zod';

export const createEntrySchema = z.object({
    title: z.string().min(1, "O título é obrigatório e não pode estar vazio."),
    body: z.string().min(1, "O corpo da entrada é obrigatório e não pode estar vazio."),
    location: z.string().optional(),
});

export const updateEntrySchema = z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    location: z.string().optional(),
});

export const entryIdSchema =  z.number().int().positive("O ID deve ser um número inteiro positivo.");