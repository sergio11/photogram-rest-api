import Media from '../models/media';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import * as consts from '../config/consts';

/**
 * Load media and append to req.
 */
function load(req, res, next, id) {
  Media.get(id).then(media => {
    if (!media) {
      throw new APIError(consts.USER_NOT_FOUND, 'Media not found', httpStatus.NOT_FOUND, true);
    }
    req.media = media;		// eslint-disable-line no-param-reassign
    return next();
  }).catch(e => {
    next(e);
  });
}

/**
 * Get Media
 * @returns {Media}
 */
function get(req, res) {
  return res.json({
    code: consts.USER_FOUND,
    status: 'success',
    data: req.media
  });
}

export default { load, get };
