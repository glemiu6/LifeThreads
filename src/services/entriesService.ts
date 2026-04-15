import { prisma } from "../lib/prisma.js";

// Criar nova Entrada (associada a uma Thread)
export const createEntry = async (threadId: number, title: string, body: string,  location: string) => {
    return await prisma.entry.create({
        data: { threadId, title, body, location, is_published: false }
    });
};

// Listar todas as Entradas de uma Thread (com suporte futuro para filtros referidos no PDF)
export const getEntriesByThread = async (threadId: number) => {
    return await prisma.entry.findMany({
        where: { threadId },
        orderBy: { entry_date: 'desc' }
    });
};

// Obter detalhes de uma Entrada específica
export const findEntryById = async (id: number) => {
    return await prisma.entry.findUnique({
        where: { id },
        include: { media: true, comments: true } // Inclui relações úteis
    });
};

// Atualizar dados de uma Entrada
export const updateEntryData = async (id: number, title: string, body: string, location: string) => {
    return await prisma.entry.update({
        where: { id },
        data:{title,body,location}
    });
};

// Eliminar Entrada
export const deleteEntry = async (id: number) => {
    return await prisma.entry.delete({
        where: { id }
    });
};

// Publicar / Despublicar Entrada
export const updateEntryPublishStatus = async (id: number, is_published: boolean) => {
    return await prisma.entry.update({
        where: { id },
        data: { is_published }
    });
};