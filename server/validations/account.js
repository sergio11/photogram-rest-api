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
  // POST /accounts/signin/facebook
  facebook: {
    body: {
      id: Joi.number().required(),
      token: Joi.string().required()
    }
  },
  // POST /accounts/signup
  signup: {
    body: {
      fullname: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
      biography: Joi.string().optional(),
      email: Joi.string().email().required(),
      mobileNumber: Joi.string().regex(/^[1-9]{9}$/).optional()
    }
  },
  // GET /accounts/confirm/{token}
  confirm: {
    params: {
      token: Joi.string().required().length(16)
    }
  },
  // POST /accounts/reset-password
  reset: {
    body: {
      email: Joi.string().email().required()
    }
  }
};
