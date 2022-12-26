import Joi from 'joi';
import { userRoles } from '../auth/auth.interface';


export const userFields = ['id', 'name', 'dob', 'bio', 'image', 'username', 'email', 'role'];

export const paramsValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    })
})

export const insertUser = Joi.object({
    name: Joi.string().min(5).max(80).required(),
    username: Joi.string().regex(/^[a-zA-Z0-9-]+$/).min(5).max(40),
    bio: Joi.string().max(240).required(),
    dob: Joi.date().required(),
    image: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required(),
    role: Joi.string().allow(...Object.values(userRoles))
})

export const updateUserValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    name: Joi.string().min(5).max(80),
    username: Joi.string().regex(/^[a-zA-Z0-9-]+$/).min(5).max(40),
    bio: Joi.string().max(240),
    dob: Joi.date(),
    image: Joi.string().uri(),
    email: Joi.string().email(),
    password: Joi.string().min(10)
}).or('name', 'username', 'bio', 'dob', 'image', 'email', 'password')


export const listingValidation = Joi.object({
    query: Joi.object({
        select: Joi.array().items(
            Joi.string().valid(...userFields)
        ),
        limit: Joi.number().min(1),
        offset: Joi.number(),
        order_by: Joi.string().valid(...['asc', 'desc']).default('asc'),
        sort_by: Joi.string().valid(...userFields)
    })
})

export const getValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    query: Joi.object({
        select: Joi.array().items(
            Joi.string().valid(...userFields)
        )
    })
})