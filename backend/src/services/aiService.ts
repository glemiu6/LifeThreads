import {ask} from "../lib/llm.js";
import {prisma} from "../lib/prisma.js";

export async function autoTagEntry(entryId:number,title:string,body:string):Promise<string[]>{
    const prompt = `
    You are a memory journaling assistant. Analyze this journal entry and return ONLY a JSON array 
    of 1 to 4 short theme tags in the same language as the text.
    No explanation, no markdown, just the raw JSON array.

    Entry title: ${title}
    Entry body: ${body}

    Example output: ["family","vacation","fun"]
    `;

    const raw = await ask(prompt);
    let tags:string[] = [];
    try{
        const clean = raw.replace(/```json|```/g,'').trim();
        tags = JSON.parse(clean);
        if(!Array.isArray(tags)) tags = [];
    } catch{
        tags = raw.match(/"([^"]+)"/g)?.map(s=>s.replace(/"/g,''))??[];
    }

    for(const tagName of tags){
        const existing  = await prisma.tag.findFirst({where:{name:tagName}});
        const finalTag = existing ?? await prisma.tag.create({data:{name:tagName,is_auto:true}});

        await prisma.entryTag.upsert({
            where:{entryId_tagId:{entryId,tagId:finalTag.id}},
            update:{},
            create:{entryId,tagId:finalTag.id}
        })

    }
    return tags;
}

//semantic search
export async function semanticSearchEntries(
    userId:number,
    query:string,
    options:{
        threadId?:number;
        limit?:number;
        onlyPublished?:boolean;
    }={}
): Promise<any[]>{
    const {threadId,limit=10,onlyPublished=false} = options;
    const entries = await prisma.entry.findMany({
        where:{
            ...(onlyPublished?{is_published :true}:{}),
            thread:{
                OR:[
                    {userId},
                    {memberships:{some:{userId}}},
                    {visibility:true}
                ],
                ...(threadId?{id:threadId}:{})
            },
        },
        include:{
                tags:{include:{tag:true}},
                media:{select:{url:true,type:true}}
            },
            orderBy:{entry_date:'desc'},
            take:100
    });

    if(entries.length === 0) return [];

    const  context = entries.map(e=>({
        id:e.id,
        title:e.title,
        body:e.body,
        tags:e.tags.map(t=>t.tag.name).join(','),
        date:e.entry_date.toISOString().split('T')[0],
        location:e.location
    }));
    const llmPrompt = `
        You are a semantic search engine for a personal memory journal.
        Return ONLY a JSON array of the most relevant entry IDs (numbers) for the query below.
        Order by relevance. Return at most ${limit} IDs. No explanation, no markdown.

        Query: "${query}"

        Entries:
        ${JSON.stringify(context, null, 2)}

        Example output: [42, 7, 15]
        `;

    const raw = await ask(llmPrompt);

    let ids:number[] =[];
    try{
        const clean = raw.replace(/```json|```/g,'').trim();
        ids = JSON.parse(clean);
        if(!Array.isArray(ids)) ids = [];
    }catch{
        ids =[]
    }

    const entryMap = new Map(entries.map(e=>[e.id,e]));
    return ids
    .map(id => entryMap.get(id))
    .filter(Boolean)
    .slice(0, limit);
}

// Monthly summary

export async function generateMonthlySummary(
    userId:number,
    year:number,
    month:number
):Promise<string> {
    const start = new Date(year,month-1,1);
    const end = new Date(year,month,1);

    const entries = await prisma.entry.findMany({
        where:{
            entry_date:{gte:start,lt:end},
            thread:{
                OR:[{userId},{memberships:{some:{userId}}}]
            }
        },
        orderBy:{entry_date:'asc'},
    })

    if(entries.length === 0) return "Sem entradas neste mes.";

    const entriesText = entries.map(e=>`[${e.entry_date.toISOString().split('T')[0]}] ${e.title}: ${e.body.slice(0,200)}`).join('\n');
    const prompt =`
    You are a warm and empathetic journaling assistant. 
    Based on these journal entries from ${year}-${String(month).padStart(2, '0')}, 
    write a short, personal monthly summary (2-4 sentences) in the same language as the entries.
    Highlight the main themes, emotions, or events. Be warm and reflective.

    Entries:
    ${entriesText}
    `;

    return await ask(prompt);
    
}

export async function generateDraft(
    prompt:string,
    mood?:string
):Promise<{title:string,body:string}>{
    const moodHint = mood? `The mood/tone should be ${mood}.`:''
    const llmPrompt = `
    You are a helpful journaling assisntant. Generate a journal entry draft based on the user's idea.
    ${moodHint}
    Return ONLY a raw JSON object with "title" and "body" fields. No markdown, no explanation.

    User idea: "${prompt}"

    Example output:
    {"title": "A quite Sunday at the park","body":"Today I decided to take a slow morning..."}
    `;
    const raw = await ask(llmPrompt);

    try{
        const clean = raw.replace(/```json|```/g,'').trim();
        const parsed = JSON.parse(clean);
        if(typeof parsed.title === 'string' && typeof parsed.body === "string"){
            return parsed;
        }
        throw new Error('Invalid shape');
    }catch{
        return{
            title:prompt.slice(0,60),
            body:raw.trim()
        }
    }
}

export async function summarizeThread(
    threadId:number,
    userId:number
):Promise<string>{
    const thread = await prisma.threads.findUnique({
        where:{id:threadId},
        include:{memberships:true}
    })

    if(!thread)throw new Error('Thread not found');

    const isOwner = thread.userId ===userId;
    const isMember = thread.memberships.some(m=>m.userId === userId);
    const isPublic = thread.visibility;
    if(!isOwner && !isMember && !isPublic) throw new Error('Access denied');
    const entries = await prisma.entry.findMany({
        where:{threadId},
        orderBy:{entry_date:"asc"},
        take:50
    });

    if(entries.length===0) return 'This thread has no entries to summarize';

    const entriesText = entries.map(e=>`[${e.entry_date.toISOString().split('T')[0]}] ${e.title}: ${e.body.slice(0,300)}`).join('\n\n');

    const llmPrompt =`
    You are a warm journaling assistant. Summarize the following thread entries into a 
    cohesive narrative paragraph (3-5 sentences). Write in the same language as the entries.
    Highlight the key moments, themes, and emotional arc. Be reflective and personal.

    Thread title: "${thread.title}"
    Thread description: "${thread.description}"

    Entries:
    ${entriesText}
    `;
    return await ask(llmPrompt)
}