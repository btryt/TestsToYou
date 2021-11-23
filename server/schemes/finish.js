const {Joi} = require('express-validation');


const scheme ={
    body: Joi.object({
        testId: Joi.number(),
        name:Joi.string().min(1).max(15),
        answers:Joi.array().items(Joi.object({
            testId:Joi.number(),
            variants:Joi.array().items(Joi.object({
                id:Joi.number(),
                correct:Joi.boolean()
            }))
        }))
    })
}



module.exports = scheme