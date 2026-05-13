import {z} from "zod";

export const summarizeSchema = z.object({
    threadId:z.coerce.number().int().positive(),
});

export const dradftSchema = z.object({
    prompt:z.string().min(3, 'Prompt must be at least 3 characters long'),
    mood:z.string().optional()
})

export const aiSearchSchema = z.object({
    q:z.string().min(1,'Search query cannot be empty'),
    threadId:z.coerce.number().int().positive().optional(),
    onlyPublished:z.coerce.boolean().optional(),
    limit:z.coerce.number().int().positive().max(50).optional()
})
