import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "LifeThreadsGrupo8";

export interface AuthenticatedRequest extends Request {
user?: { id: number; role?: string };
}

export const authGuard =(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(404).json({error:'Acesso negado. Token em falta.'})
        return
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET) as {
            id:number,
            role?:string
        }
        req.user = decoded;
        next();

    }catch(error){
        res.status(403).json({ error: "Token inválido ou expirado." });
    }
}