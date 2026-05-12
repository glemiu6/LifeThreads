import {z} from 'zod';

export const reactionSchema = z.object({
    type:z.enum(['LIKE','HEART','DISLIKE','SHOCK'])
});