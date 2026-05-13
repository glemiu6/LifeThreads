import { prisma } from "../lib/prisma.js";

export const findAllThreads = async (userId: number) => {
  return await prisma.threads.findMany({
    where: {
      OR: [
        { userId },
        { memberships: { some: { userId } } }
      ]
    }
  });
};

export const createThread = async (userId: number, title: string, description: string, visibility: boolean) => {
  return await prisma.threads.create({ data: { userId, title, description, visibility } });
};

export const findThreadsbyId = async (id: number) => {
  return await prisma.threads.findUnique({
    where: { id },
    include: { memberships: true }
  });
};

export const updateThreadsData = async (id: number, title: string, description: string) => {
  return await prisma.threads.update({
    where: { id },
    data: { title, description }
  });
};

export const deleteThread = async (id: number) => {
  const entries = await prisma.entry.findMany({ where: { threadId: id }, select: { id: true } });
  const entryIds = entries.map(e => e.id);

  await prisma.entryTag.deleteMany({ where: { entryId: { in: entryIds } } });
  await prisma.entryReaction.deleteMany({ where: { entryId: { in: entryIds } } });
  await prisma.comment.deleteMany({ where: { entryId: { in: entryIds } } });
  await prisma.media.deleteMany({ where: { entryId: { in: entryIds } } });

  await prisma.entry.deleteMany({ where: { threadId: id } });
  await prisma.membership.deleteMany({ where: { threadId: id } });
  await prisma.invite.deleteMany({ where: { threadsId: id } });

  return await prisma.threads.delete({ where: { id } });
};

export const updateVisibilityThread = async (id: number, visibility: boolean) => {
  return await prisma.threads.update({
    where: { id },
    data: { visibility }
  });
};

export const explorePublicThreads = async () => {
  return await prisma.threads.findMany({ where: { visibility: true } });
};

export const searchThreadsPublic = async (q: string) => {
  return await prisma.threads.findMany({
    where: {
      visibility: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }
  });
};