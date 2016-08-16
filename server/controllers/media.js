import Media from '../models/media';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import codes from '../codes/media';

/**
 * Load media and append to req.
 */
function load(req, res, next, id) {
  Media.get(id).then(media => {
    if (!media) {
      throw new APIError(codes.MEDIA_NOT_FOUND, 'Media not found', httpStatus.NOT_FOUND, true);
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
    code: codes.MEDIA_FOUND,
    status: 'success',
    data: req.media
  });
}

/**
* Search for recent media in a given area.
* @returns {Media[]}
*/

function search(req, res, next) {
  Media.search(req.lat, req.lon).then(medias => {
    if (!medias || medias.length === 0) {
      throw new APIError(codes.MEDIA_NOT_FOUND, 'Media not found', httpStatus.NOT_FOUND, true);
    }
    return res.json({
      code: codes.MEDIA_FOUND,
      status: 'success',
      data: req.media
    });
  }).catch(e => {
    next(e);
  });
}

export default { load, get, search };
