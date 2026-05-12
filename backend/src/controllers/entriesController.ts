import { type Request, type Response } from 'express';
import * as entriesService from '../services/entriesService.js';
import { createEntrySchema, entryIdSchema, updateEntrySchema } from '../schema/entriesSchema.js';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';


export const createEntry = async (req: Request, res: Response) => {
    const threadId = Number(req.params.id);
    const result = createEntrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const newEntry = await entriesService.createEntry(threadId, result.data.title, result.data.body, result.data.location ?? "");
    res.status(201).json(newEntry);
};

export const listEntriesByThread = async (req: Request, res: Response) => {
    const threadId = Number(req.params.id);
    const entries = await entriesService.getEntriesByThread(threadId);
    res.status(200).json(entries);
};

export const getEntryById = async (req: Request, res: Response) => {
    const result = entryIdSchema.safeParse(Number(req.params.id));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const entry = await entriesService.findEntryById(result.data);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.status(200).json(entry);
};

export const updateEntryInfo = async (req: Request, res: Response) => {
    const idEntry = Number(req.params.id);
    const result = updateEntrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const updatedEntry = await entriesService.updateEntryData(idEntry, result.data.title ?? "", result.data.body ?? "", result.data.location ?? "");
    res.status(200).json(updatedEntry);
};

export const deleteEntry = async (req: Request, res: Response) => {
    const result = entryIdSchema.safeParse(Number(req.params.id));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    await entriesService.deleteEntry(result.data);
    res.status(204).send();
};

export const publishEntry = async (req: Request, res: Response) => {
    const result = entryIdSchema.safeParse(Number(req.params.id));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const publishedEntry = await entriesService.updateEntryPublishStatus(result.data, true);
    res.status(200).json(publishedEntry);
};

export const unpublishEntry = async (req: Request, res: Response) => {
    const result = entryIdSchema.safeParse(Number(req.params.id));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const unpublishedEntry = await entriesService.updateEntryPublishStatus(result.data, false);
    res.status(200).json(unpublishedEntry);
};