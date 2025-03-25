const Joi = require("joi");
const createHttpError = require("http-errors");

const getOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^(0|(\+98|\+49))[1-9][0-9]{9,10}$/)  
    .error(createHttpError.BadRequest("The entered phone number is invalid")),
});

const checkOtpSchema = Joi.object({
  otp: Joi.string()
    .min(5)
    .max(6)
    .error(createHttpError.BadRequest("The entered OTP is invalid")),
  phoneNumber: Joi.string()
    .pattern(/^(0|(\+98|\+49))[1-9][0-9]{9,10}$/)  
    .error(createHttpError.BadRequest("The entered phone number is invalid")),
});

const completeProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("The entered username is invalid")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("The entered email is invalid")),
  role: Joi.string()
    .required()
    .valid("FREELANCER", "OWNER")
    .error(createHttpError.BadRequest("The entered role is invalid")),
});

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(50)
    .required()
    .error(createHttpError.BadRequest("Invalid username entered")),
  email: Joi.string()
    .required()
    .email()
    .error(createHttpError.BadRequest("Invalid email entered")),
  phoneNumber: Joi.string()
    .pattern(/^(0|(\+98|\+49))[1-9][0-9]{9,10}$/)  
    .error(createHttpError.BadRequest("Invalid phone number entered")),
  biography: Joi.string()
    .max(30)
    .allow("")
    .error(createHttpError.BadRequest("Invalid expertise area")),
});

module.exports = {
  getOtpSchema,
  completeProfileSchema,
  checkOtpSchema,
  updateProfileSchema,
};
