const Joi =  require("joi");

const todoSchema = Joi.object({
    taskName : Joi.string().required(),
    createdAt : Joi.date().required(),
    dueAt : Joi.date().greater(Joi.ref("createdAt")).required(),
    importance : Joi.string().valid("low","medium","high").required(),
    status : Joi.string().valid("pending","in-progress","completed").required(),
});

module.exports = {todoSchema};