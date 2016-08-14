import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // GET /media/media-id
  get: {
    params: {
      id: Joi.objectId()
    }
  }
};
