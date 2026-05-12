import {type Request, type Response} from 'express';
import * as NotificationService from "../services/notificationService.js";
import { NotificationIdSchema, UpdateNotificationSchema ,CreateNotificationSchema} from "../schema/notificationSchema.js";
import {type AuthenticatedRequest} from '../middleware/authGuard.js';



  export const getByUser=async(req: Request, res: Response) =>{
    
      const result = NotificationIdSchema.safeParse(req.params.id);
      if(!result.success){

      }
      const data = await NotificationService.getAllByUser(Number(req.params.userId));
      res.status(200).json(data);
    
  }

  export const updateStatus=async(req: Request, res: Response)=> {
    
      const idNotif = NotificationIdSchema.safeParse(req.params.id)
      const result  = UpdateNotificationSchema.safeParse(req.body);
      if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
      }
      if(!idNotif.success){
        return res.status(404).json({error:idNotif.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
      }
      const updated = await NotificationService.updateReadStatus(idNotif.data,result.data.is_read);
      res.status(204).json(updated);
    
  }

  export const createNotification = async(req: Request, res: Response) => {
    
      const result  = CreateNotificationSchema.safeParse(req.body);
      if (!result.success){
        return res.status(400).json({error:result.error.issues.map((issue)=>`${issue.path}: ${issue.message}`)});
      }
      const created = await NotificationService.createNotification(result.data.userId,result.data.type);
      res.status(201).json(created);
    
  }

  export const markAllRead = async (req: Request, res: Response) => {
    await NotificationService.markAllRead(Number(req.params.id));
    res.status(204).send();
  }

  export const deleteNotification = async (req: Request, res: Response) => {
    const id= Number(req.params.id);
    await NotificationService.deleteNotification(id);
    res.status(204).send();
  }