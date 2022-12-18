import Joi from "joi";

export const paramsValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    })
})

export const insertValidation = Joi.object({
    title: Joi.string().min(2).max(70).required(),
    image: Joi.string().uri(),
    description: Joi.string().max(220),
    release_date: Joi.date(),
    author: Joi.string().min(4).required()
});

export const updateValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    title: Joi.string().min(2).max(70),
    image: Joi.string().uri(),
    description: Joi.string().max(220),
    release_date: Joi.date(),
}).or('title', 'image', 'description', 'release_date')