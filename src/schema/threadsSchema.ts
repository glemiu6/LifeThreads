import {z} from 'zod';

export const createThreadSchema = z.object({
    title: z.string().trim().min(3,'Minim 3 characters').max(20,'Maximum 20 characters'),
    description: z.string()
})

export const threadIdSchema =z.object( {id:z.coerce.number().int().positive()})

export const updateThreadSchema = z.object({
    title: z.string().trim().min(3,'Minim 3 characters').max(20,"maximum 20 characters"),
    description: z.string()
})

export const updateVisibilityThreadSchema = z.object({
    visibility: z.boolean()
})

export const searchQuerySchema = z.object({
    q: z.string().trim().min(1,'Query cannot be empty')
})