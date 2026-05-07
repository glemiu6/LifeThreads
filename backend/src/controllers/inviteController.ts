import { type Response } from 'express';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';
import * as threadsService from '../services/threadsService.js';
import * as invitesService from '../services/inviteService.js';
import * as membershipsService from '../services/membershipService.js';
import { getUserById } from '../services/userService.js';
import { threadIdSchema, inviteSchema, updatedInviteStatusSchema } from '../schema/threadsSchema.js';

export const inviteUserToThread = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.userId !== userId) return res.status(403).json({ error: 'Not the thread owner' });

  const bodyResult = inviteSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const invite = await invitesService.inviteUserToThread(idResult.data.id, bodyResult.data.email, bodyResult.data.expires_at);
  res.status(201).json(invite);
};

export const respondToInvite = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const invite = await invitesService.findInviteById(idResult.data.id);
  if (!invite) return res.status(404).json({ error: 'Invite not found' });

  const user = await getUserById(userId);
  if (invite.email !== user?.email) return res.status(403).json({ error: 'This invite is not for you' });
  if (invite.expires_at < new Date()) return res.status(400).json({ error: 'Invite expired' });
  if (invite.status !== 'PENDING') return res.status(400).json({ error: 'Invite already responded to' });

  const bodyResult = updatedInviteStatusSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const updated = await invitesService.respondToInvite(idResult.data.id, bodyResult.data.response);
  if (bodyResult.data.response === 'ACCEPTED') {
    await membershipsService.addMemberToThread(invite.threadsId, userId, 'OBSERVER');
  }
  res.status(200).json(updated);
};