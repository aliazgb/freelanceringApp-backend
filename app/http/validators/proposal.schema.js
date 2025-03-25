const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../utils/constants");

const addProposalSchema = Joi.object({
  description: Joi.string()
    .required()
    .error(createError.BadRequest("Invalid description submitted")),
  price: Joi.number().error(createError.BadRequest("Invalid price entered")),
  duration: Joi.number()
    .required()
    .error(createError.BadRequest("Please enter the project duration")),
  projectId: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("Invalid project ID entered")),
});

module.exports = {
  addProposalSchema,
};
