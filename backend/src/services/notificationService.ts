import type { Reaction } from "../generated/prisma/index.js";
import {prisma} from "../lib/prisma.js";


export const getAllByUser= async(userId:number)=>{
  return await prisma.notification.findMany({
    where:{userId},
    orderBy:{created_at:'desc'}

  })
}

export const updateReadStatus = async(id:number,is_read:boolean)=>{
  return await prisma.notification.update({
    where:{id},
    data:{is_read}
  })
}

export const createNotification = async(userId:number,type:Reaction)=>{
  return await prisma.notification.create({
    data:{
      userId,
      type
    }
  })
}

export const markAllRead = async(userId:number)=>{
  return await prisma.notification.updateMany({
    where:{userId,is_read:false},
    data:{is_read:true}
  })
}

export const deleteNotification = async (id:number)=>{
  return await prisma.notification.delete({
    where:{id}
  })
}