import Joi from "joi";

export const paramsValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    })
})

export const insertUser = Joi.object({
    name: Joi.string().min(5).max(80).required(),
    username: Joi.string().min(5).max(40).required(),
    bio: Joi.string().max(240),
    dob: Joi.date(),
    image: Joi.string().uri()
})

export const updateUserValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    name: Joi.string().min(5).max(80),
    username: Joi.string().min(5).max(40),
    bio: Joi.string().max(240),
    dob: Joi.date(),
    image: Joi.string().uri()
}).or('name', 'username', 'bio', 'dob', 'image')
