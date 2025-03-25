const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../utils/constants");

const addProjectSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(30)
    .error(createError.BadRequest("Invalid product title")),
  description: Joi.string()
    .required()
    .error(createError.BadRequest("Invalid product title")),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createError.BadRequest("Tags cannot exceed 20 items")),
  category: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("Invalid category selection")),
  budget: Joi.number().error(createError.BadRequest("Invalid price input")),
  deadline: Joi.date()
    .required()
    .error(createError.BadRequest("Please enter the project deadline")),
});

module.exports = {
  addProjectSchema,
};
