import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // UPDATE /api/users/:id
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
      id: Joi.objectId()
    }
  },
  // DELETE  /api/users/:id
  deleteUser: {
    params: {
      id: Joi.objectId()
    }
  }
};
