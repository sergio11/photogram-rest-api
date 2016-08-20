import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // GET /media/media-id
  get: {
    params: {}
  },
  // GET /media/search
  search: {
    params: {
      lon: Joi.number().precision(8),
      lat: Joi.number().precision(8)
    }
  },
  // POST /media
  create: {
    body: {
      type: Joi.string().required().valid(['IMAGE', 'VIDEO']),
      caption: Joi.string().optional().min(6),
      link: Joi.string().required(),
      location: Joi.array().length(2).items(Joi.number().precision(8)),
      user: Joi.objectId().required()
    }
  }
};
