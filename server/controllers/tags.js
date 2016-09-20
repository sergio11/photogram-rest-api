import Term from '../models/term';
import MediaTagged from '../models/mediaTagged';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import * as codes from '../codes/tags';
import { Observable } from 'rxjs/Rx';
import _ from 'lodash';

/**
 * Load term and append to req.
 */
function load(req, res, next, id) {
  Term.get(id).then(term => {
    if (!term) {
      throw new APIError(
        codes.TERM_NOT_FOUND,
        res.__('Term not found'),
        httpStatus.NOT_FOUND,
        true
      );
    }
    req.term = term;		// eslint-disable-line no-param-reassign
    return next();
  }).catch(e => {
    next(e);
  });
}

/**
 * Create new tag
 * @property {string} req.body.name - The term's name
 * @property {string} req.body.slug - The term's slug
 * @property {string} req.body.descripcion - The term's description
 * @returns {integer} _id
 */
function create(req, res, next) {
  const term = new Term({
    name: req.body.name,
    slug: req.body.slug,
    descripcion: req.body.descripcion,
    _user: req.auth
  });

  term.saveAsync().then(savedTerm => {
    res.json({
      code: codes.TERM_CREATED,
      status: 'success',
      data: {
        id: savedTerm._id,
        message: res.__('Term created')
      }
    });
  }).catch(e => next(e));
}

/**
* Delete Term.
* @returns {Term}
*/
function remove(req, res, next) {
  const term = req.term;
  term.removeAsync()
  .then(deletedTerm => {
    res.json({
      code: codes.TERM_DELETED,
      status: 'success',
      data: deletedTerm
    });
  })
  .catch((e) => next(e));
}

/**
 * Get Term
 * @returns {Term}
 */
function get(req, res, next) {
  Observable.fromPromise(
    MediaTagged.getMediaTaggedCount(req.term._id)
  ).zip(
    Observable.of(req.term),
    (medias, term) => _.extend(term.toObject(), medias)
  ).subscribe(
    term => res.json({
      code: codes.TERM_FOUND,
      status: 'success',
      data: term
    }),
    err => next(err)
  );
}

/**
 * Get Term
 * @returns {Term}
 */
function recently(req, res, next) {
  MediaTagged.getRecentlyTaggedMedia({ count: req.query.count })
  .then(mediaTagged => {
    res.json({
      code: codes.RECENTLY_TAGGED_MEDIA,
      status: 'success',
      data: mediaTagged
    });
  }).catch(() => {
    next(new APIError(
      codes.NO_RECENTLY_TAGGED_MEDIA,
      res.__('No recently tagged media'),
      httpStatus.NOT_FOUND,
      true
    ));
  });
}

/**
 * Search Terms
 * @returns {[Tags]}
 */
function search(req, res, next) {
  const q = req.query.q;
  Term.like(q).then(terms => {
    res.json({
      code: codes.TERMS_MATCHED,
      status: 'success',
      data: terms
    });
  }).catch(() => {
    next(new APIError(
      codes.NO_TERM_WAS_FOUND,
      res.__('No Term was found'),
      httpStatus.NOT_FOUND,
      true
    ));
  });
}

export default { load, get, recently, search, create, remove };
