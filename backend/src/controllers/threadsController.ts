import { type Request, type Response } from 'express';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';
import * as threadsService from '../services/threadsService.js';
import { createThreadSchema, threadIdSchema, updateThreadSchema, searchQuerySchema, updateVisibilityThreadSchema } from '../schema/threadsSchema.js';

export const cretateThread = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = createThreadSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const { title, description } = result.data;
  const newThread = await threadsService.createThread(userId, title, description, false);
  res.status(201).json(newThread);
};

export const listThreadsUsers = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const threads = await threadsService.findAllThreads(userId);
  res.status(200).json(threads);
};

export const getThreadById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = threadIdSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(result.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });

  const isOwner = thread.userId === userId;
  const isMember = thread.memberships.some((m) => m.userId === userId);
  if (!thread.visibility && !isOwner && !isMember) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.status(200).json(thread);
};

export const updateThreadInfo = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.userId !== userId) return res.status(403).json({ error: 'Not the thread owner' });

  const bodyResult = updateThreadSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const { title, description } = bodyResult.data;
  const updatedThread = await threadsService.updateThreadsData(idResult.data.id, title, description);
  res.status(200).json(updatedThread);
};

export const deleteThread = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = threadIdSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(result.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.userId !== userId) return res.status(403).json({ error: 'Not the thread owner' });

  await threadsService.deleteThread(result.data.id);
  res.status(204).send();
};

export const updateVisibilityThread = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const idResult = threadIdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({ error: idResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const thread = await threadsService.findThreadsbyId(idResult.data.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.userId !== userId) return res.status(403).json({ error: 'Not the thread owner' });

  const bodyResult = updateVisibilityThreadSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const updatedThread = await threadsService.updateVisibilityThread(idResult.data.id, bodyResult.data.visibility);
  res.status(200).json(updatedThread);
};

export const explorePublicThreads = async (req: Request, res: Response) => {
  const threads = await threadsService.explorePublicThreads();
  res.status(200).json(threads);
};

export const searchPublicThreads = async (req: Request, res: Response) => {
  const result = searchQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const threads = await threadsService.searchThreadsPublic(result.data.q);
  res.status(200).json(threads);
};