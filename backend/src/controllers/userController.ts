import { type Request, type Response } from "express";
import * as userService from "../services/userService.js";
import { createUserSchema, searchUserSchema, updateUserSchema,userIdSchema } from "../schema/userSchema.js";
import { type AuthenticatedRequest } from '../middleware/authGuard.js';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: "Failed to find users" });
    }
};

export const createUserController = async (req: Request, res: Response) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const user = await userService.createUser(result.data.name, result.data.email, result.data.password, "", result.data.avatar);
    res.status(201).json(user);
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
    const result = userIdSchema.safeParse(req.params); 
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    if (!req.user) {
        return res.status(401).json({ error: "Utilizador não autenticado." });
    }
    const requestedId=result.data.id;
    if(req.user.id!==requestedId){
        res.status(403).json({ error: "Acesso negado. Apenas pode consultar o seu próprio perfil." });
    }
    try{
        const user = await userService.getUserById(requestedId); 
        if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
        const{password,...safeUser} = user;
        res.status(200).json(safeUser);
    }catch(error){
        res.status(500).json({error:'Erro interno do servidor.'})
    }
    
};

export const updateMe = async (req: Request, res: Response) => {
    const idUser = Number(req.params.id);
    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const updated = await userService.updateUserService(idUser, String(result.data.name), String(result.data.email), String(result.data.bio), String(result.data.avatar));
    res.status(200).json(updated);
};

export const deleteMe = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    await userService.deleteUserService(result.data.id); 
    res.status(204).send();
};

export const getPublicProfile = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse((req.params));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const user = await userService.getUserById(result.data.id);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.status(200).json(user);
};

export const searchUsers = async (req: Request, res: Response) => {
    const result = searchUserSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const results = await userService.searchUsersService(result.data.query);
    res.status(200).json(results);
};

export const followUser = async (req: Request, res: Response) => {
    const followerId = Number(req.params.id);
    const { followingId } = req.body;
    try {
        const follow = await userService.followUserService(followerId, followingId);
        res.status(201).json(follow);
    } catch (error) {
        res.status(400).json({ error: "Não foi possível seguir o utilizador" });
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    const followerId = Number(req.params.id);
    const { followingId } = req.body;
    try {
        await userService.unfollowUserService(followerId, followingId);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: "Não foi possível deixar de seguir o utilizador" });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse((req.params));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const list = await userService.getFollowingService(result.data.id); 
    res.status(200).json(list);
};

export const getFollowers = async (req: Request, res: Response) => {
    const result = userIdSchema.safeParse((req.params));
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues.map((issue) => `${issue.path}: ${issue.message}`) });
    }
    const list = await userService.getFollowersService(result.data.id); 
    res.status(200).json(list);
};