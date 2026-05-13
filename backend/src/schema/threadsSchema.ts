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

export const inviteSchema = z.object({
  email: z.string().email('Invalid email'),
  expires_at: z.coerce.date().refine(
    (date) => date > new Date(),
    'Expiry date must be in the future'
  )
});

export const updateMembershipRoleSchema = z.object({
    role: z.enum(['ADMIN', 'COLLABORATOR', 'OBSERVER'])
})

export const updatedInviteStatusSchema = z.object({
    id: z.coerce.number().int().positive(),
    response: z.enum(['ACCEPTED', 'DECLINE'])
})

export const monthlySummarySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12)
});