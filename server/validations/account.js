import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // POST /accounts/signin
  signin: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/)
    }
  },
  // POST /accounts/signup
  signup: {
    body: {
      fullname: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
      biography: Joi.string().optional(),
      email: Joi.string().email(),
      mobileNumber: Joi.string().regex(/^[1-9]{9}$/).required()
    }
  }
};
