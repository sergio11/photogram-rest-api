import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // GET /media/media-id
  get: {
    params: {
      id: Joi.objectId()
    }
  },
  // GET /media/search
  search: {
    param: {
      lon: Joi.number().precision(8),
      lat: Joi.number().precision(8)
    }
  }
};
