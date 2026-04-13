import {type Request, type Response} from 'express';
import * as threadsService from '../services/threadsService.js';
import {createThreadSchema,threadIdSchema} from '../schema/threadsSchema.js';

export const cretateThread = async(req:Request,res:Response)=>{
    const {userId,title,description} = req.body;
    const result = createThreadSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const newThread = await threadsService.createThread(userId,title,description,false);
    res.status(201).json(newThread);
}

export const listThreads = async(req:Request,res:Response)=>{
    try{
        const threads= await threadsService.getAllThreads();
        res.status(200).json(threads)
    }
    catch(error){
        res.status(400).json({error:'failed to find thread'})
    }
}

export const listThreadsUsers = async(req:Request,res:Response) =>{
    const result = threadIdSchema.safeParse(Number(req.params.id));

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const threadUser = await threadsService.findAllThreads(Number(req.params.id))
    res.status(200).json(threadUser)
}