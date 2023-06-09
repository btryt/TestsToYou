const {Joi} = require('express-validation');


const schema ={
    body: Joi.object({
        testId: Joi.number().integer().required(),
        name:Joi.string().min(1).max(15).trim().required(),
        answers:Joi.array().items(Joi.object({
            testId:Joi.number().integer().required(),
            variants:Joi.array().items(Joi.object({
                id:Joi.number().integer().required(),
                correct:Joi.boolean().required()
            })).min(1).max(4)
        })).min(1).max(40)
    })
}



module.exports = schema