const {Joi} = require('express-validation');


const scheme ={
    body: Joi.object({
        testId: Joi.number().required(),
        name:Joi.string().min(1).max(15).required(),
        answers:Joi.array().items(Joi.object({
            testId:Joi.number().required(),
            variants:Joi.array().items(Joi.object({
                id:Joi.number().required(),
                correct:Joi.boolean().required()
            })).min(1).max(4)
        })).min(1).max(40)
    })
}



module.exports = scheme