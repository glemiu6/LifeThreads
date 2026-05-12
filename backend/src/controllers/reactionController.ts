import {type Response} from 'express';
import {type AuthenticatedRequest} from '../middleware/authGuard.js';
import * as reactionService from '../services/reactionService.js';
import {reactionSchema} from '../schema/reactioonSchema.js';

export const reactToEntry = async (req:AuthenticatedRequest,res:Response) => {
    const userId = req.user?.id;
    const entryId = Number(req.params.id);
    const result = reactionSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const reaction = await reactionService.reactToEntry(userId!,entryId,result.data.type);
    res.status(201).json(reaction);
}

export const removeReaction = async(req:AuthenticatedRequest,res:Response) => {
    const userId = req.user?.id;
    const entryId = Number(req.params.id);
    const reaction = await reactionService.removeReaction(userId!,entryId);
    res.status(200).json(reaction);
}