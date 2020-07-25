const Joi = require("@hapi/joi");

// defined here so we only need to change them in ...
// ... one file instead of changing in Models too
const validationLengths = {
  name: {
    min: 6,
    max: 100,
  },
  email: {
    min: 6,
    max: 320,
  },
  password: {
    min: 6,
    max: 30,
  },
};

//(JSON.parse(req.body))

const registerValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(validationLengths.name.min)
      .max(validationLengths.name.max)
      .required(),
    email: Joi.string()
      .min(validationLengths.email.min)
      .max(validationLengths.email.max)
      .email()
      .required(),
    password: Joi.string()
      .min(validationLengths.password.min)
      .max(validationLengths.password.max)
      .required(),
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(validationLengths.email.min)
      .max(validationLengths.email.max)
      .email()
      .required(),
    password: Joi.string()
      .min(validationLengths.password.min)
      .max(validationLengths.password.max)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  validationLengths,
  registerValidation,
  loginValidation,
};
