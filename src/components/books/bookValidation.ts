import Joi from 'joi';

export const bookFields = ['id', 'title', 'image', 'description', 'release_date', 'author', 'created_at', 'updated_at']

export const paramsValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    })
})

export const listingValidation = Joi.object({
    query: Joi.object({
        select: Joi.array().items(
            Joi.string().valid(...bookFields)
        ),
        limit: Joi.number().min(1),
        offset: Joi.number(),
        order_by: Joi.string().valid(...['asc', 'desc']).default('asc'),
        sort_by: Joi.string().valid(...bookFields)
    })
})

export const getValidation = Joi.object({
    params: Joi.object({
        id: Joi.number().required(),
    }),
    query: Joi.object({
        select: Joi.array().items(
            Joi.string().valid(...bookFields)
        )
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