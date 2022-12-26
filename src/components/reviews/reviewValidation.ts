import Joi from 'joi';

export const reviewFields = ['id', 'title', 'body', 'book_ref', 'user_ref']

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

export const listingValidation = Joi.object({
    query: Joi.object({
        select: Joi.array().items(
            Joi.string().valid(...reviewFields)
        ),
        limit: Joi.number().min(1),
        offset: Joi.number(),
        order_by: Joi.string().valid(...['asc', 'desc']).default('asc'),
        sort_by: Joi.string().valid(...reviewFields)
    })
})

export const getValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    query: Joi.object({
        select: Joi.array().items(
            Joi.string().valid(...reviewFields)
        )
    })
})