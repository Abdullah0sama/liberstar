import Joi from "joi";

export const authValidation = Joi.object({
    password: Joi.string().required(),
    email: Joi.string(),
    id: Joi.string(),
    username: Joi.string()
}).or('id', 'email', 'username')