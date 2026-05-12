import {prisma} from '../lib/prisma.js';

export const addTagTontry = async(entryId:number,tagName:string) => {
    const existingTag = await prisma.tag.findFirst({
        where:{name:tagName}
    })
    const finalTag = existingTag ?? await prisma.tag.create({
        data:{name:tagName}
    })
    return await prisma.entryTag.create({
        data:{entryId,tagId:finalTag.id}
    })
}

export const removeTagFromEntry = async(entryId:number,tagId:number)=>{
    return await prisma.entryTag.delete({
        where:{entryId_tagId:{entryId,tagId}}
    })
}

export const getTagsEntry =async(entryId:number) => {
    return await prisma.entryTag.findMany({
        where:{entryId},
        include:{tag:true}
    })
}