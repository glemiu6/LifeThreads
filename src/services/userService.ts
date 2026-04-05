import {prisma} from "../lib/prisma.js";

export const findAllUsers = async()=>{
    return await prisma.users.findMany();
}

export const createUser = async(name:string,email:string,password:string,bio:string,avatar:string)=>{
    return await prisma.users.create({data:{name,email,password,bio,avatar}})
}