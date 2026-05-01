import { prisma } from "../lib/prisma.js";
import type { Roles } from "../generated/prisma/index.js";

export const findThreadMembers = async (threadId: number) => {
  return await prisma.membership.findMany({
    where: { threadId },
    include: { user: { select: { id: true, name: true, avatar: true } } }
  });
};

export const addMemberToThread = async (threadId: number, userId: number, role: Roles) => {
  return await prisma.membership.create({
    data: { threadId, userId, role }
  });
};

export const updateMemberRole = async (threadId: number, userId: number, role: Roles) => {
  return await prisma.membership.update({
    where: { threadId_userId: { threadId, userId } },
    data: { role }
  });
};

export const removeMember = async (threadId: number, userId: number) => {
  return await prisma.membership.delete({
    where: { threadId_userId: { threadId, userId } }
  });
};