import {prisma} from "../lib/prisma.js";
import bcrypt from 'bcryptjs';
import { Prisma } from '../generated/prisma/index.js';

export const findAllUsers = async()=>{
    return await prisma.users.findMany();
}


export const createUser = async (name: string, email: string, password: string, bio: string, avatar: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    return await prisma.users.create({ data: { name, email, password: hashedPassword, bio, avatar } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new Error('EMAIL_TAKEN');
    }
    throw err;
  }
};

export const getUserById = async (id: number) => {
  return await prisma.users.findUnique({
    where: { id }
  });
};

export const updateUserService = async (id: number, name:string,email:string,bio:string,avatar:string) => {
  return await prisma.users.update({
    where: { id },
    data:{
      name: name,
      email: email,
      bio: bio,
      avatar: avatar
    }
  });
};

export const deleteUserService = async (id: number) => {
  return await prisma.users.delete({ where: { id } });
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

export const followUserService = async (followerId: number, followingId: number) => {
  return await prisma.following.create({ data: { followerId, followingId } });
};

export const unfollowUserService = async (followerId: number, followingId: number) => {
  return await prisma.following.delete({
    where: { followerId_followingId: { followerId, followingId } }
  });
};

export const getFollowingService = async (userId: number) => {
  return await prisma.following.findMany({
    where: { followerId: userId },
  });
};

export const getFollowersService = async (userId: number) => {
  return await prisma.following.findMany({
    where: { followingId: userId }
  });
};

export const findUserByEmail = async(email:string)=>{
  return await prisma.users.findUnique({
    where:{email}
  })
};