import {type Request, type Response} from "express";
import * as userService from "../services/userService.js";

export const getUsers = async(req:Request,res:Response)=>{
    const user = await userService.findAllUsers();
    res.json(user)
}

export const createUserController = async(req:Request,res:Response)=>{
    try{
        const{name,email,password,bio,avatar} = req.body;
        const user = await userService.createUser(name,email,password,bio,avatar)
        res.status(201).json(user)
    }
    catch(error){
        res.status(400).json({error:'Dados invalidos'})
    }
}