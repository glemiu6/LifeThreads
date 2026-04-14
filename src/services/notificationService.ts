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