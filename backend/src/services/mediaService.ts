import {prisma} from '../lib/prisma.js';

export const addMedia = async(entryId:number,url:string,type:string) => {
    return await prisma.media.create({
        data:{
            entryId,
            url,
            type
        }
    })
};

export const removeMedia = async(mediaId:number) => {
    return await prisma.media.delete({
        where:{id:mediaId}
    })
};