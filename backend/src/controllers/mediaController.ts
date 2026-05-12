import {type Response} from 'express';
import {type AuthenticatedRequest} from '../middleware/authGuard.js';
import * as mediaService from '../services/mediaService.js';
import {mediaSchema} from '../schema/mediaSchema.js';

export const addMedia = async(req:AuthenticatedRequest,res:Response) => {
    const entryid = Number(req.params.id);
    const result = mediaSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const media = await mediaService.addMedia(entryid,result.data.url,result.data.type);
    res.status(201).json(media);
};

export const removeMedia = async(req:AuthenticatedRequest,res:Response) => {
    const mediaId = Number(req.params.id);
    await mediaService.removeMedia(mediaId);
    res.status(204).send();
};