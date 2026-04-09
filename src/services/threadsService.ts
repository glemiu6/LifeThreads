import {prisma} from "../lib/prisma.js";
// Listar as Threads do utilizador
export const findAllThreads = async(userId:number)=>{
    return await prisma.threads.findMany({
        where:{
            OR:[
                {userId},
                {memberships:{some:{userId}}}
            ]
        }
    }
        
    );
}
// Criar nova Thread
export const createThread = async(userId:number,title:string,description:string,visibility:boolean)=>{
    return await prisma.threads.create({data:{userId,title,description,visibility}});
}

// Obter detalhes de uma Thread
export const findThreadsbyId = async(id:number)=>{
    return await prisma.threads.findUnique(
        {where:{id}}
    )
};

// Atualizar dados da Thread
export const updateThreadsData = async(id:number,title:string,description:string)=>{
    return await prisma.threads.update({
        where:{id},
        data:{title,description}

    })
};

//Eliminar Thread
export const deleteThread = async(id:number)=>{
    return await prisma.threads.delete({
        where:{id}
    })
};

// alterar para private | public
export const updateVisibilityThread = async(id:number,visibility:boolean)=>{
    return await prisma.threads.update({
        where:{id},
        data:{visibility}
    }
    )
};

//explorar threads públicas
export const explorePublicThreads = async()=>{
    return await prisma.threads.findMany({
        where:{visibility:true}
    })
};

//pesquisar threads publicas
export const searchThreadsPublic = async(q:string)=>{
    return await prisma.threads.findMany({
        where:{visibility:true,
        OR:[
            {title:{contains:q,mode:'insensitive'}},
            {description:{contains:q,mode:'insensitive'}}
        ]}
    })
};