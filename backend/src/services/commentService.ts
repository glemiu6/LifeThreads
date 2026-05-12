import {prisma} from '../lib/prisma.js';

export const getCommentsByEntry = async (entryId:number)=>{
    return await prisma.comment.findMany({
        where:{entryId},
        include:{author:{select:{id:true,name:true,avatar:true}}},
        orderBy:{created_at:'asc'}
    })
};

export const createComment = async (entryId:number,userId:number,body:string)=>{
    return await prisma.comment.create({
        data:{ entryId,userId,body},
        include:{author:{select:{id:true,name:true,avatar:true}}}
    })
};

export const deleteComment = async (id:number)=>{
    return await prisma.comment.delete({
        where:{id}
    })

};

export const findCommentByID = async (id:number)=>{
    return await prisma.comment.findUnique({
        where:{id}
    })
}