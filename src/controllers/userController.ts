import {type Request, type Response} from "express";
import * as userService from "../services/userService.js";
import {createUserSchema,searchUserSchema} from "../schema/userSchema.js"

export const getUsers = async(req:Request,res:Response)=>{
    const user = await userService.findAllUsers();
    res.json(user)
}

export const createUserController = async(req:Request,res:Response)=>{
        const result = createUserSchema.safeParse(req.body)
        if(!result.success){
          return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});}
        const user = await userService.createUser(result.data.name,result.data.email,result.data.password,"",result.data.avatar)
        res.status(201).json(user)
}


/**
 * @openapi
 * /api/users/me:
 * get:
 * summary: Obtém o perfil do utilizador autenticado
 * tags: [Users]
 * responses:
 * 200:
 * description: Dados do utilizador retornados com sucesso
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter perfil" });
  }
};

/**
 * @openapi
 * /api/users/me:
 * put:
 * summary: Atualiza os dados do perfil próprio
 * tags: [Users]
 */
export const updateMe = async (req: Request, res: Response) => {
  try {
    const updated = await userService.updateUserService(Number(req.params.id), req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar perfil" });
  }
};

/**
 * @openapi
 * /api/users/search:
 * get:
 * summary: Pesquisa utilizadores por nome ou email
 * tags: [Users]
 */
export const searchUsers = async (req: Request, res: Response) => {
  const result = searchUserSchema.safeParse(req.query)
  if(!result.success){
      return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
  }
  const search = await userService.searchUsersService(result.data.query)
  res.status(200).json(search)
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId= Number(req.params.id)
    const following = req.body.followingId;
    const user = await userService.followUserService(followerId, following);
    res.status(204).json(user);
  } catch (error) {
    res.status(400).json({ error: "Não foi possível seguir o utilizador" });
  }
};