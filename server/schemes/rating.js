const {Joi} = require('express-validation');

const schema ={
    body: Joi.object({
        rating:Joi.number().integer().min(1).max(5).required(),
        testId:Joi.number().integer().required()
    }
)}

module.exports = schema