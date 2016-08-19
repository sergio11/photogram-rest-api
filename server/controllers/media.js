import Media from '../models/media';
import Comment from '../models/comment';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import codes from '../codes/media';
import { Observable } from 'rx/Rx';

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
  Observable.fromPromise(Media.search(req.lat, req.lon))
  .flatMap(medias => {
    if (!medias || medias.length === 0) {
      throw new APIError(codes.MEDIA_NOT_FOUND, 'Media not found', httpStatus.NOT_FOUND, true);
    }
    return Observable.fromArray(medias);
  })
  .flatMap(media => Observable.fromPromise(
    Comment.getCommentsCountForMedia(media._id)
  ).zip(Observable.just(media), (comments, media2) => {
    console.log('Comments: ', comments);
    console.log('Media: ', media2);
  }))
  .subscribe(
    medias => res.json({
      code: codes.MEDIA_FOUND,
      status: 'success',
      data: medias
    }),
    err => next(err)
  );
}

/**
 * Create new media
 * @property {string} req.body.type - The media's type
 * @property {string} req.body.caption - The media's caption
 * @property {string} req.body.link - The media's link
 * @property {Number} req.body.location - The media's location
 * @property {ObjectId} req.body._user - The media's owner
 * @returns {Media}
 */
function create(req, res) {
  const media = new Media({
    type: req.body.type,
    caption: req.body.caption,
    link: req.body.link,
    location: req.body.location,
    _user: req.body._user
  });
  res.send(media);
  console.log('Media: ', media);
}

export default { load, get, search, create };
