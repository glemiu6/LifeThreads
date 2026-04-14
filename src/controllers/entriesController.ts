import { type Request, type Response } from 'express';
import * as entriesService from '../services/entriesService.js';
// Nota: Precisas de criar estes schemas num ficheiro `entriesSchema.ts` semelhante ao `threadsSchema.ts`
import { createEntrySchema, entryIdSchema, updateEntrySchema } from '../schema/entriesSchema.js';

export const createEntry = async (req: Request, res: Response) => {
    const threadId = Number(req.params.threadId);
    const { title, body, entry_date, location } = req.body;
    
    const result = createEntrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }

    try {
        const newEntry = await entriesService.createEntry(threadId, title, body, new Date(entry_date), location);
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create entry' });
    }
};

export const listEntriesByThread = async (req: Request, res: Response) => {
    const threadId = Number(req.params.threadId);
    
    // De acordo com o PDF, aqui poderiam entrar os filtros: req.query.date, req.query.month, req.query.theme
    try {
        const entries = await entriesService.getEntriesByThread(threadId);
        res.status(200).json(entries);
    } catch (error) {
        res.status(400).json({ error: 'Failed to find entries for this thread' });
    }
};

export const getEntryById = async (req: Request, res: Response) => {
    const result = entryIdSchema.safeParse(Number(req.params.id));

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    
    const idEntry = Number(req.params.id);
    const entry = await entriesService.findEntryById(idEntry);
    
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.status(200).json(entry);
};

export const updateEntryInfo = async (req: Request, res: Response) => {
    const idEntry = Number(req.params.id);
    const { title, body, location } = req.body;
    
    const result = updateEntrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    
    try {
        const updatedEntry = await entriesService.updateEntryData(idEntry, title, body, location);
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update entry' });
    }
};

export const deleteEntry = async (req: Request, res: Response) => {
    const result = entryIdSchema.safeParse(Number(req.params.id));

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    
    const idEntry = Number(req.params.id);
    await entriesService.deleteEntry(idEntry);
    res.status(204).json({ message: 'Entry deleted successfully' });
};

export const publishEntry = async (req: Request, res: Response) => {
    const idEntry = Number(req.params.id);
    try {
        const publishedEntry = await entriesService.updateEntryPublishStatus(idEntry, true);
        res.status(200).json(publishedEntry);
    } catch (error) {
        res.status(400).json({ error: 'Failed to publish entry' });
    }
};

export const unpublishEntry = async (req: Request, res: Response) => {
    const idEntry = Number(req.params.id);
    try {
        const unpublishedEntry = await entriesService.updateEntryPublishStatus(idEntry, false);
        res.status(200).json(unpublishedEntry);
    } catch (error) {
        res.status(400).json({ error: 'Failed to unpublish entry' });
    }
};