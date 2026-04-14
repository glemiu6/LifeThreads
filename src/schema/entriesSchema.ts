import { z } from 'zod';

export const createEntrySchema = z.object({
    title: z.string()
        .min(1, "O título é obrigatório e não pode estar vazio."),
    
    body: z.string()
        .min(1, "O corpo da entrada é obrigatório e não pode estar vazio."),
    
    entry_date: z.string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Data inválida. Utilize um formato ISO 8601.",
        }),
    
    location: z.string().optional(),
});

export const updateEntrySchema = z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    location: z.string().optional(),
});

export const entryIdSchema = z.preprocess(
    (val) => Number(val), 
    z.number().int().positive("O ID deve ser um número inteiro positivo.")
);