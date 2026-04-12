import { threadId } from "node:worker_threads";
import {prisma} from "../lib/prisma.js";
import type { Roles, Stat } from "../generated/prisma/index.js";

// Listar as Threads do utilizador
export const findAllThreads = async(userId:number)=>{
    return await prisma.threads.findMany({
        where:{
            OR:[
                {userId},
                {memberships:{some:{userId}}}
            ]
        }
    }
        
    );
}
// Criar nova Thread
export const createThread = async(userId:number,title:string,description:string,visibility:boolean)=>{
    return await prisma.threads.create({data:{userId,title,description,visibility}});
}

// Obter detalhes de uma Thread
export const findThreadsbyId = async(id:number)=>{
    return await prisma.threads.findUnique(
        {where:{id}}
    )
};

// Atualizar dados da Thread
export const updateThreadsData = async(id:number,title:string,description:string)=>{
    return await prisma.threads.update({
        where:{id},
        data:{title,description}

    })
};

//Eliminar Thread
export const deleteThread = async(id:number)=>{
    return await prisma.threads.delete({
        where:{id}
    })
};

// alterar para private | public
export const updateVisibilityThread = async(id:number,visibility:boolean)=>{
    return await prisma.threads.update({
        where:{id},
        data:{visibility}
    }
    )
};

//explorar threads públicas
export const explorePublicThreads = async()=>{
    return await prisma.threads.findMany({
        where:{visibility:true}
    })
};

//pesquisar threads publicas
export const searchThreadsPublic = async(q:string)=>{
    return await prisma.threads.findMany({
        where:{visibility:true,
        OR:[
            {title:{contains:q,mode:'insensitive'}},
            {description:{contains:q,mode:'insensitive'}}
        ]}
    })
};
//Convidar utilizador para a Thread

export const inviteUserToThread =async(threadsId:number, email:string,expires_at:Date)=>{
    return await prisma.invite.create({
        data:{ threadsId,
            email,
            expires_at,
            status:'PENDING'
        }
    })
}
//Listar membros da Thread

export const findThreadMembers = async(threadId:number)=>{
    return await prisma.membership.findMany({
        where:{threadId},
        include:{user:{select:{id:true,name:true,avatar:true}}}
    })};

// alterar papel do membro

export const updateMemberRole = async(threadId:number,userId:number,role:Roles)=>{
    return await prisma.membership.update({
        where:{threadId_userId:{threadId,userId}},
        data:{role}
    })
}
//remover membro

export const removeMember = async(threadId:number,userId:number)=>{
    return await prisma.membership.delete({
        where:{threadId_userId:{threadId,userId}}
    })
}
//sair de thread

export const leaveThread = async(threadId:number,userId:number)=>{
    return await prisma.membership.delete({
        where:{threadId_userId:{threadId,userId}}
    })
}