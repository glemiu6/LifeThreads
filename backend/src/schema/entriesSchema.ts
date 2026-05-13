import { z } from 'zod';

export const createEntrySchema = z.object({
  title: z.string().min(1, 'O título é obrigatório e não pode estar vazio.'),
  body: z.string().min(1, 'O corpo da entrada é obrigatório e não pode estar vazio.'),
  location: z.string().optional()
});

export const updateEntrySchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  location: z.string().optional()
});

export const entryIdSchema = z.number().int().positive('O ID deve ser um número inteiro positivo.');

export const entryStatusSchema = z.object({
  is_published: z.boolean()
});

export const draftSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters'),
  mood: z.string().optional()
});


export const searchEntriesSchema = z.object({
  q: z.string().min(1, 'Query cannot be empty'),
  threadId: z.number().int().positive().optional(),       
  limit: z.number().int().min(1).max(50).optional(),     
  onlyPublished: z.boolean().optional()                    
});