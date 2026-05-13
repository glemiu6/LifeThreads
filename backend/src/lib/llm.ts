import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const provider = process.env.LLM_PROVIDER ?? "ollama";

// Gemini

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

async function askGemini(prompt:string):Promise<string>{
    const model =gemini.getGenerativeModel({model:"gemini-1.5-flash"})
    const result = await model.generateContent(prompt);
    return result.response.text();
}

// Ollama

async function askOllama(prompt:string):Promise<string>{
    const res = await fetch(`${process.env.OLLAMA_URL}/api/generate`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            model:process.env.OLLAMA_MODEL,
            prompt,
            stream:false
        })
    });
    const data = await res.json() as {response:string};
    return data.response;
}

// single entry point

export async function ask(prompt:string):Promise<string>{
    try{
        if (provider === "ollama") return await askOllama(prompt);
        return await askGemini(prompt);
    } catch(err){
        console.error(`[LLM] ${provider} failed, trying fallback...`,err);

        try{
            if(provider === "ollama") return await askGemini(prompt);
            return await askOllama(prompt);
        }catch(err){
            console.error(`[LLM] Fallback also failed`,err);
            throw new Error("LLM request failed");
        }
    }
}