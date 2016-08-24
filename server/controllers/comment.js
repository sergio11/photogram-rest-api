import Comment from '../models/comment';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import * as codes from '../codes/comment';


/**
 * Load comment and append to req.
 */
function load(req, res, next, id) {
  Comment.get(id).then(comment => {
    if (!comment) {
      throw new APIError(
        codes.COMMENT_NOT_FOUND,
        res.__('Comment not found'),
        httpStatus.NOT_FOUND,
        true
      );
    }
    req.comment = comment;		// eslint-disable-line no-param-reassign
    return next();
  }).catch(e => {
    next(e);
  });
}

/**
* Get Comments
* @returns {Array[Comment]}
*/
function get(req, res, next) {
  Comment.getCommentsForMedia(req.media).then(comments => {
    res.json({
      code: codes.COMMENTS_FOUND,
      status: 'success',
      data: comments
    });
  }).catch(() => {
    next(new APIError(
      codes.NO_COMMENTS_FOUND,
      res.__('No such comments for media!'),
      httpStatus.NOT_FOUND,
      true
    ));
  });
}

/**
 * Create new comment
 * @property {string} req.body.text - The comment's text
 * @property {ObjectId} req.body.from - The comment's owner
 * @returns {Comment}
 */
function create(req, res, next) {
  const comment = new Comment({
    text: req.body.text,
    _media: req.media._id,
    _from: req.body.from
  });
  comment.saveAsync()
    .then(savedComment => {
      res.json({
        code: codes.CREATE_COMMENT_SUCCESS,
        status: 'success',
        data: savedComment
      });
    })
    .catch(e => {
      console.log(e);
      next(new APIError(
        codes.CREATE_COMMENT_FAIL,
        res.__('Create Comment Fail'),
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      ));
    });
}

/**
 * Delete Comment.
 * @returns {Comment}
 */
function remove(req, res, next) {
  const comment = req.comment;
  comment.removeAsync()
    .then(deletedComment => {
      res.json({
        code: codes.COMMENT_DELETED,
        status: 'success',
        data: deletedComment
      });
    })
    .catch(() => {
      next(new APIError(
        codes.DELETE_COMMENT_FAILED,
        res.__('Delete Comment Failed'),
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      ));
    });
}


export default { get, create, load, remove };
