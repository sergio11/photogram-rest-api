import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // POST /api/v1/media/media-id/comments
  create: {
    body: {
      text: Joi.string().required().min(10).max(300),
      from: Joi.objectId().required()
    }
  }
};
