import Comment from '../models/comment';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import * as codes from '../codes/comment';

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

export default { get };
