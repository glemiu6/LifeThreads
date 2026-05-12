import { type Response } from 'express';
import { type AuthenticatedRequest } from '../middleware/authGuard.js';
import * as commentService from '../services/commentService.js';
import {commetnBodySchema} from '../schema/commentSchema.js';

export const getComment = async ( req:AuthenticatedRequest,res:Response)=>{
    const entryId = Number(req.params.id);
    const comments = await commentService.getCommentsByEntry(entryId);
    res.status(200).json(comments);
}

export const createComment = async( req:AuthenticatedRequest,res:Response)=>{
    const userId = req.user?.id
    const entryId = Number(req.params.id);
    const result = commetnBodySchema.safeParse(req.body);
   if (!result.success) {
    return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
  }
  const comment = await commentService.createComment(entryId,userId!,result.data.body);
  res.status(201).json(comment);
};

export const deleteComment = async ( req:AuthenticatedRequest,res:Response)=>{
    const userId = req.user?.id
    const commentId = Number(req.params.id);
    const comment = await commentService.findCommentByID(commentId);
    if(!comment) return res.status(404).json({error:'Comment not found'});
    if(comment.userId !== userId) return res.status(403).json({error:'Not the comment owner'});
    await commentService.deleteComment(commentId);
    res.status(204).send();
}

