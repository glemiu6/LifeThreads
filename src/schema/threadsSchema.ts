import {z} from 'zod';

export const createThreadSchema = z.object({
    userId: z.coerce.number().int().positive("O Id tem de ser positivo"),
    title: z.string().trim().min(3,'Minim 3 characters').max(20,'Maximum 10 characters'),
    description: z.string()
    
})

export const threadIdSchema = z.coerce.number().int().positive()

export const updateThreadSchema = z.object({
    title: z.string().trim().min(3,'Minim 3 characters').max(20,"maximum 20 characters"),
    description: z.string()
})