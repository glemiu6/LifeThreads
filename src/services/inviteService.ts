import { prisma } from "../lib/prisma.js";

export const inviteUserToThread = async (threadsId: number, email: string, expires_at: Date) => {
  return await prisma.invite.create({
    data: { threadsId, email, expires_at, status: 'PENDING' }
  });
};

export const findInviteById = async (id: number) => {
  return await prisma.invite.findUnique({ where: { id } });
};

export const respondToInvite = async (id: number, response: 'ACCEPTED' | 'DECLINE') => {
  return await prisma.invite.update({
    where: { id },
    data: { status: response }
  });
};