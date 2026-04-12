import {type Request, type Response} from 'express';
import * as threadsService from '../services/threadsService.js';
import {createThreadSchema} from '../schema/threadsSchema.js';

export const cretateThread = async(req:Request,res:Response)=>{
    const {userId,title,description} = req.body;
    const result = createThreadSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const newThread = await threadsService.createThread(userId,title,description,false);
    res.status(201).json(newThread);
}