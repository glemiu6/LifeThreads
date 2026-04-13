import {type Request, type Response} from 'express';
import * as threadsService from '../services/threadsService.js';
import {createThreadSchema,threadIdSchema,updateThreadSchema,searchQuerySchema,updateVisibilityThreadSchema} from '../schema/threadsSchema.js';

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
    const idUser = Number(req.params.id);
    const threadUser = await threadsService.findAllThreads(idUser);
    res.status(200).json(threadUser)
}

export const getThreadById = async(req:Request,res:Response)=>{
    const result = threadIdSchema.safeParse(Number(req.params.id));

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const idThread = Number(req.params.id);
    const thread = await threadsService.findThreadsbyId(idThread);
    res.status(200).json(thread)
}

export const updateThreadInfo = async(req:Request,res:Response)=>{
    const idThread = Number(req.params.id);
    const {title,description} = req.body;
    const result = updateThreadSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const updatedThread = await threadsService.updateThreadsData(idThread,title,description);
    res.status(200).json(updatedThread)
}

export const deleteThread = async(req:Request,res:Response)=>{
    const result = threadIdSchema.safeParse(Number(req.params.id));

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const idThread = Number(req.params.id);
    await threadsService.deleteThread(idThread);
    res.status(204).json({message:'Thread deleted successfully'});
}


export const updateVisibilityThread = async(req:Request,res:Response)=>{
    const idThread = Number(req.params.id);
    const {visibility} = req.body;
    const result = updateVisibilityThreadSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const updatedThread = await threadsService.updateVisibilityThread(idThread,visibility);
    res.status(200).json(updatedThread)
}

export const explorePublicThreads = async(req:Request,res:Response)=>{
    const publicThreads = await threadsService.explorePublicThreads();
    res.status(200).json(publicThreads)
}

export const searchPublicThreads = async(req:Request,res:Response)=>{
    const result = searchQuerySchema.safeParse(req.query);

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const {q} = result.data
    const searchResults = await threadsService.searchThreadsPublic(q);
    res.status(200).json(searchResults)
} 
