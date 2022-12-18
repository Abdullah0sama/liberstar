import Joi from "joi";

export const paramsValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    })
})

export const insertVaidation = Joi.object({
    body: Joi.string().min(5).required(),
    title: Joi.string().min(5).required(),
    book_ref: Joi.number().required(),
    user_ref: Joi.number().required()
})

export const updateValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.string().min(5),
    title: Joi.string().min(5),
})