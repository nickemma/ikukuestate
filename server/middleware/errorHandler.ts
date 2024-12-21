import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from "express"
import { HTTPSTATUS } from '../config/http.config';


export const errorHandler: ErrorRequestHandler = (error, req:Request, res:Response, next:NextFunction): any => {
    console.error(`Error occurred on PATH: ${req.path}`, error);

    if(error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'Invalid JSON payload passed.'
        });
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', 
        error: error?.message || 'Unknown error occurred'
     });
}