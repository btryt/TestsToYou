const {Joi} = require('express-validation');

const scheme = {
    body: Joi.object({
        testTitle:Joi.string().min(5).max(110),
        showCorrect: Joi.boolean(),
        linkAccess: Joi.boolean(),
        tests:Joi.array().items(Joi.object({
            id:Joi.number(),
            title:Joi.string().min(1).max(110),
            multiple:Joi.boolean(),
            variants:Joi.array().items(Joi.object({
                id:Joi.number(),
                title:Joi.string().min(1).max(90),
                correct:Joi.boolean()
            }))
        }))
    })
}

module.exports = scheme