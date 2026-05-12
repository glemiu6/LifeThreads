import {z} from 'zod';

export const commetnBodySchema = z.object({
    body:z.string().min(1)
});

export const CommentIdSchema = z.coerce.number().int().positive()