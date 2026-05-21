import {type Request, type Response, type NextFunction} from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err:any,req:Request,res:Response,next:NextFunction) => {
    const statusCode = err.status || err.statusCode || 500;
    const payload:any = {
        success: false,
        status: statusCode,
        error: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    };

    if (err instanceof ZodError) {
        const failedFields = Array.from(new Set(
            err.issues
                .map((issue:any) => issue.path.join('.'))
                .filter((field:string) => field.length > 0)
        ));

        payload.issues = err.issues;
        payload.failedFields = failedFields;
    } else if (err.issues) {
        payload.issues = err.issues;
    }

    res.status(statusCode).json(payload);
};