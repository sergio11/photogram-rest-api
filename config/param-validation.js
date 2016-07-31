import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      fullname: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
      biography: Joi.string().optional(),
      email: Joi.string().email(),
      mobileNumber: Joi.string().regex(/^[1-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      fullname: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/),
      website: Joi.string().optional(),
      biography: Joi.string().optional(),
      email: Joi.string().email(),
      mobileNumber: Joi.string().regex(/^[1-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /accounts/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/)
    }
  }
};
