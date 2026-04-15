import {prisma} from "../lib/prisma.js";

export const findAllUsers = async()=>{
    return await prisma.users.findMany();
}

export const createUser = async(name:string,email:string,password:string,bio:string,avatar:string)=>{
    return await prisma.users.create({data:{name,email,password,bio,avatar}})
}

export const getUserById = async (id:number) => {
  return await prisma.users.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, avatar: true, bio: true}
  });
};

export const updateUserService = async (id: number, data: any) => {
  return await prisma.users.update({
    where: { id },
    data,
  });
};

export const searchUsersService = async (query: string) => {
  return await prisma.users.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, name: true, avatar: true }
  });
};


export const followUserService=async(followerId:number,followingId:number)=>{
  return await prisma.following.create({
    data:{followerId:followerId,followingId:followingId}
  })
}

