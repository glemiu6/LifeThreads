import {z} from 'zod';

export const mediaSchema = z.object({
    url:z.string().url(),
    type:z.enum(['IMAGE','VIDEO','DOCUMENT'])
})