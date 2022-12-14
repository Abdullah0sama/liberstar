
import Joi from "joi";
import express from 'express';
import { UnporcessableEntity } from "./Errors";
export function Validation(schema: Joi.Schema) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = { ...req.body, }
            if (Object.keys(req.params).length !== 0) Object.assign(data, { params: req.params })  
            await schema.validateAsync(data)
            next()
        } catch (err: any) {
            next(new UnporcessableEntity(err));
        }
    }
}