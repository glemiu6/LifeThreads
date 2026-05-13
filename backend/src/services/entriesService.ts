import { prisma } from "../lib/prisma.js";

export const createEntry = async (threadId: number, title: string, body: string,  location: string) => {
    return await prisma.entry.create({
        data: { threadId, title, body, location, is_published: false }
    });
};

export const getEntriesByThread = async (threadId: number) => {
  return await prisma.entry.findMany({
    where: { threadId },
    orderBy: { entry_date: 'desc' },
    include: {
      tags: { include: { tag: true } },
      media: true,
      comments: true
    }
  });
};

export const findEntryById = async (id: number) => {
    return await prisma.entry.findUnique({
        where: { id },
        include: { media: true, comments: true } // Inclui relações úteis
    });
};

export const updateEntryData = async (id: number, title: string, body: string, location: string) => {
    return await prisma.entry.update({
        where: { id },
        data:{title,body,location}
    });
};

export const deleteEntry = async (id: number) => {
  await prisma.entryTag.deleteMany({ where: { entryId: id } });
  await prisma.entryReaction.deleteMany({ where: { entryId: id } });
  await prisma.comment.deleteMany({ where: { entryId: id } });
  await prisma.media.deleteMany({ where: { entryId: id } });

  return await prisma.entry.delete({ where: { id } });
};

export const updateEntryPublishStatus = async (id: number, is_published: boolean) => {
    return await prisma.entry.update({
        where: { id },
        data: { is_published }
    });
};