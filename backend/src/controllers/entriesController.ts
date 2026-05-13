import { type Request, type Response } from 'express';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';
import * as entriesService from '../services/entriesService.js';
import { autoTagEntry, semanticSearchEntries, generateDraft, summarizeThread, generateMonthlySummary } from '../services/aiService.js';
import { createEntrySchema, updateEntrySchema, entryIdSchema, entryStatusSchema, draftSchema, searchEntriesSchema } from '../schema/entriesSchema.js';
import { threadIdSchema, monthlySummarySchema } from '../schema/threadsSchema.js';

// ── Thread entries ────────────────────────────────────────────────────────────

export const createEntry = async (req: AuthenticatedRequest, res: Response) => {
  const threadId = Number(req.params.id);
  const result = createEntrySchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  const newEntry = await entriesService.createEntry(threadId, result.data.title, result.data.body, result.data.location ?? '');
  res.status(201).json(newEntry);
};

export const listEntriesByThread = async (req: Request, res: Response) => {
  const threadId = Number(req.params.id);
  const entries = await entriesService.getEntriesByThread(threadId);
  res.status(200).json(entries);
};

// ── Single entry CRUD ─────────────────────────────────────────────────────────

export const getEntryById = async (req: Request, res: Response) => {
  const result = entryIdSchema.safeParse(Number(req.params.id));
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  const entry = await entriesService.findEntryById(result.data);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.status(200).json(entry);
};

export const updateEntryInfo = async (req: Request, res: Response) => {
  const idEntry = Number(req.params.id);
  const result = updateEntrySchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  const updatedEntry = await entriesService.updateEntryData(idEntry, result.data.title ?? '', result.data.body ?? '', result.data.location ?? '');
  res.status(200).json(updatedEntry);
};

export const deleteEntry = async (req: Request, res: Response) => {
  const result = entryIdSchema.safeParse(Number(req.params.id));
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  await entriesService.deleteEntry(result.data);
  res.status(204).send();
};

// ── Entry status  ─────────────────────

export const updateStatus = async (req: Request, res: Response) => {
  const idResult = entryIdSchema.safeParse(Number(req.params.id));
  if (!idResult.success)
    return res.status(400).json({ error: idResult.error.issues.map(i => `${i.path}: ${i.message}`) });

  const bodyResult = entryStatusSchema.safeParse(req.body);
  if (!bodyResult.success)
    return res.status(400).json({ error: 'is_published (boolean) is required' });

  const updated = await entriesService.updateEntryPublishStatus(idResult.data, bodyResult.data.is_published);
  res.status(200).json(updated);
};

// ── AI ────────────────────────────────────────────────────────────────────────

// POST /api/entries/:id/tags
export const tagEntry = async (req: AuthenticatedRequest, res: Response) => {
  const result = entryIdSchema.safeParse(Number(req.params.id));
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  const entry = await entriesService.findEntryById(result.data);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  try {
    const tags = await autoTagEntry(entry.id, entry.title, entry.body);
    res.status(200).json({ tags });
  } catch {
    res.status(503).json({ error: 'LLM unavailable, try again later' });
  }
};

// POST /api/entries/search
export const searchEntries = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = searchEntriesSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  try {
    const entries = await semanticSearchEntries(userId, result.data.q, {
  ...(result.data.threadId !== undefined && { threadId: result.data.threadId }),
  ...(result.data.limit !== undefined && { limit: result.data.limit }),
  ...(result.data.onlyPublished !== undefined && { onlyPublished: result.data.onlyPublished })
});
    res.status(200).json(entries);
  } catch {
    res.status(503).json({ error: 'LLM unavailable, try again later' });
  }
};

// POST /api/entries/draft
export const generateEntryDraft = async (req: AuthenticatedRequest, res: Response) => {
  const result = draftSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  try {
    const draft = await generateDraft(result.data.prompt, result.data.mood);
    res.status(200).json(draft);
  } catch {
    res.status(503).json({ error: 'LLM unavailable, try again later' });
  }
};

// GET /api/threads/:id/summary
export const getThreadSummary = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = threadIdSchema.safeParse(req.params);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  try {
    const summary = await summarizeThread(result.data.id, userId);
    res.status(200).json({ summary });
  } catch (err: any) {
    if (err.message === 'Thread not found') return res.status(404).json({ error: 'Thread not found' });
    if (err.message === 'Access denied')    return res.status(403).json({ error: 'Access denied' });
    res.status(503).json({ error: 'LLM unavailable, try again later' });
  }
};

// GET /api/threads/summary?year=&month=
export const getMonthlySummary = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const result = monthlySummarySchema.safeParse(req.query);
  if (!result.success)
    return res.status(400).json({ error: result.error.issues.map(i => `${i.path}: ${i.message}`) });

  try {
    const summary = await generateMonthlySummary(userId, result.data.year, result.data.month);
    res.status(200).json({ summary });
  } catch {
    res.status(503).json({ error: 'LLM unavailable, try again later' });
  }
};