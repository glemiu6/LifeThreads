import {prisma} from '../lib/prisma.js';
import type {ReactionType} from '../generated/prisma/index.js';

export const reactToEntry = async (userId:number,entryId:number,type:ReactionType)=>{
    // upsert -> update if exists, create if not
    return await prisma.entryReaction.upsert({
        where:{userId_entryId:{userId,entryId}},
        update:{type},
        create:{userId,entryId,type}
    })
}

export const removeReaction = async (userId:number,entryId:number)=>{
    return await prisma.entryReaction.delete({
        where:{userId_entryId:{userId,entryId}}
    });
};