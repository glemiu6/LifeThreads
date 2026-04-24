import { type Request, type Response } from "express";
import * as userService from "../services/userService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtToken=process.env.JWT_SECRET||"LifeThreadsGrupo8";


export const login = async(req:Request,res:Response)=>{
    const {email,password} = req.body;

    const user = await userService.findUserByEmail(email);
    if(!user||!(await bcrypt.compare(password,user.password))){
        return res.status(401).json({error:'Credenciais inválidas'})
    }
    const token = jwt.sign({id:user.id},jwtToken,{expiresIn:"1h" })
    res.json({token});
}