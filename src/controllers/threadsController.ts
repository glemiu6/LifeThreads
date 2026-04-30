import {type Request, type Response} from 'express';
import * as threadsService from '../services/threadsService.js';
import {createThreadSchema,threadIdSchema,updateThreadSchema,searchQuerySchema,updateVisibilityThreadSchema} from '../schema/threadsSchema.js';
import {type AuthenticatedRequest} from '../middleware/authGuard.js'
// POST /api/threads
export const cretateThread = async(req:AuthenticatedRequest,res:Response)=>{
    const userId = req.user!.id;
    const result = createThreadSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const {title,description} = result.data;
    const newThread = await threadsService.createThread(userId,title,description,false);
    res.status(201).json(newThread);
}

// GET /api/threads/
export const listThreadsUsers = async(req:AuthenticatedRequest,res:Response) =>{
    const userId = req.user!.id;
    const threadUser = await threadsService.findAllThreads(userId);
    res.status(200).json(threadUser)
}
// GET /api/threads/:id
export const getThreadById = async(req:AuthenticatedRequest,res:Response)=>{
    const result = threadIdSchema.safeParse(req.params);

    if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
    }
    const thread = await threadsService.findThreadsbyId(result.data.id);
    res.status(200).json(thread)
}
// PUT /api/threads/:id
export const updateThreadInfo = async(req:AuthenticatedRequest,res:Response)=>{
    const userId = req.user!.id;
    const idResult = threadIdSchema.safeParse(req.params.id);
    if (!idResult.success){
        return res.status(400).json({
            error:idResult.error.issues.map((issue)=>{`${issue.path}: ${issue.message}`})
        });
    }
    const thread = await threadsService.findThreadsbyId(idResult.data.id);
    if(!thread){
        return res.status(404).json({error:'Thread not found'});
    }
    if(thread.userId !== userId){
        return res.status(403).json({error:'Not the thread owner'})
    }

    const bodyResult = updateThreadSchema.safeParse(req.body);
    if(!bodyResult.success){
        return res.status(400).json({
            error:bodyResult.error.issues.map((issue)=> `${issue.path}: ${issue.message}`)
        });
    }
    const {title,description} = bodyResult.data;
    const updatedThread = await threadsService.updateThreadsData(idResult.data.id,title,description);
    res.status(200).json(updatedThread)
}

// DELETE /api/threads/:id
export const deleteThread = async(req:AuthenticatedRequest,res:Response)=>{
    const userId = req.user!.id;

    const result = threadIdSchema.safeParse(req.params)
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
