import express from 'express';
import validate from 'express-validation';
import mediaValidation from '../validations/media';
import commentValidation from '../validations/comment';
import mediaCtrl from '../controllers/media';
import commentCtrl from '../controllers/comment';
import user from '../../config/connectRoles';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/:id')
  /**
  * @api {get} /api/v1/media/media-id  Get information about media object
  * @apiVersion 1.0.0
  * @apiName GetMedia
  * @apiGroup Media
  */
  .get(validate(mediaValidation.get), mediaCtrl.get)
  /**
  * @api {delete} /api/v1/media/media-id  Delete media object
  * @apiVersion 1.0.0
  * @apiName DeleteMedia
  * @apiGroup Media
  */
  .delete(user.can('delete media'), mediaCtrl.remove);

/**
* @api {post} /api/v1/media Create media
* @apiVersion 1.0.0
* @apiName CreateMedia
* @apiGroup Media
*/
router.post('/', validate(mediaValidation.create), mediaCtrl.create);

/**
* @api {get} /api/v1/media/search Search for recent media in a given area.
* @apiVersion 1.0.0
* @apiName SearchMedia
* @apiGroup Media
*/
router.get('/search', validate(mediaValidation.search), mediaCtrl.search);

router.route('/:id/comments')
  /**
  * @api {get} /api/v1/media/media-id/comments  Get a list of recent comments on a media object.
  * @apiVersion 0.0.1
  * @apiName GetComments
  * @apiGroup Comments
  */
  .get(commentCtrl.get)
  /**
  * @api {post} /api/v1/media/media-id/comments  create comment for media object.
  * @apiVersion 0.0.1
  * @apiName CreateComment
  * @apiGroup Comments
  */
  .post(validate(commentValidation.create), commentCtrl.create);


router.route('/:id/comments/:commentId')
  /**
  * @api {delete} /api/v1/media/media-id/comments/comment-id  Delete comment
  * @apiVersion 0.0.1
  * @apiName DeleteComment
  * @apiGroup Comments
  */
  .delete(user.can('delete comment'), commentCtrl.remove);


/** Load media when API with id route parameter is hit */
router.param('id', mediaCtrl.load);
/** Load comment when API with commentId route parameter is hit */
router.param('commentId', commentCtrl.load);

export default router;
