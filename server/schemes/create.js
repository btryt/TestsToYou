const {Joi} = require('express-validation');

const scheme = {
    body: Joi.object({
        testTitle:Joi.string().min(5).max(110).trim().required(),
        showCorrect: Joi.boolean().required(),
        linkAccess: Joi.boolean().required(),
        tests:Joi.array().items(Joi.object({
            id:Joi.number().integer().required(),
            title:Joi.string().min(1).max(110).trim().required(),
            multiple:Joi.boolean().required(),
            variants:Joi.array().items(Joi.object({
                id:Joi.number().integer().required(),
                title:Joi.string().min(1).max(90).trim().required(),
                correct:Joi.boolean().required()
            })).min(1).max(4)
        })).min(1).max(40)
    })
}

module.exports = scheme