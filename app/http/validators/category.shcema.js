const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

const addCategorySchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("The Persian category title is invalid")),

  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("The English category title is invalid")),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(createHttpError.BadRequest("The category description is invalid")),
  type: Joi.string()
    .required()
    .min(3)
    .max(100)
    .valid("project", "post", "comment", "ticket")
    .error(createHttpError.BadRequest("The category type is invalid")),
  parent: Joi.string()
    .allow("")
    .pattern(MongoIDPattern)
    .error(createHttpError.BadRequest("The submitted ID is invalid")),
});

const updateCategorySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("The Persian category title is invalid")),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("The English category title is invalid")),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(
      createHttpError.BadRequest("The category description is not correct")
    ),
  type: Joi.string()
    .required()
    .min(3)
    .max(100)
    .valid("product", "post", "comment", "ticket")
    .error(createHttpError.BadRequest("Category type is not correct")),
});

module.exports = {
  addCategorySchema,
  updateCategorySchema,
};
