import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);

export default {
  // GET /api/v1/tags/search?q=snowy
  search: {
    params: {
      q: Joi.string().required()
    }
  },
  // GET /api/v1/tags/slug/media/recent
  recently: {
    params: {
      count: Joi.number().required(),
      min_tag_id: Joi.objectId(),
      max_tag_id: Joi.objectId()
    }
  },
  // POST
  create: {
    body: {
      name: Joi.string().required(),
      slug: Joi.string().required(),
      descripcion: Joi.string()
    }
  }
};
