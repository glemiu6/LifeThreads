import { type Response } from 'express';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';
import * as threadsService from '../services/threadsService.js';
import * as membershipsService from '../services/membershipService.js';
import { threadIdSchema, updateMembershipRoleSchema } from '../schema/threadsSchema.js';
import { userIdSchema } from '../schema/userSchema.js';

export const listThreadsMembers = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });

  const isOwner = thread.userId === userId;
  const isMember = thread.memberships.some((m) => m.userId === userId);
  if (!isOwner && !isMember) return res.status(403).json({ error: 'Access denied' });

  const members = await membershipsService.findThreadMembers(idResult.data.id);
  res.status(200).json(members);
};

export const removeSelfFromThread = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });

  const isMember = thread.memberships.some((m) => m.userId === userId);
  if (!isMember) return res.status(403).json({ error: 'You are not a member of this thread' });

  await membershipsService.removeMember(idResult.data.id, userId);
  res.status(204).send();
};

export const updateMemberRole = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.userId !== userId) return res.status(403).json({ error: 'Not the thread owner' });

  const memberIdResult = userIdSchema.safeParse({ id: req.params.userId });
  if (!memberIdResult.success) {
    return res.status(400).json({ error: memberIdResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const roleBody = updateMembershipRoleSchema.safeParse(req.body);
  if (!roleBody.success) {
    return res.status(400).json({ error: roleBody.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const updated = await membershipsService.updateMemberRole(idResult.data.id, memberIdResult.data.id, roleBody.data.role);
  res.status(200).json(updated);
};

export const removeMember = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.userId !== userId) return res.status(403).json({ error: 'Not the thread owner' });

  const memberIdResult = userIdSchema.safeParse({ id: req.params.userId });
  if (!memberIdResult.success) {
    return res.status(400).json({ error: memberIdResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  await membershipsService.removeMember(idResult.data.id, memberIdResult.data.id);
  res.status(204).send();
};