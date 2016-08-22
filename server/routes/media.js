import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/media';
import mediaCtrl from '../controllers/media';
import user from '../../config/connectRoles';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/:id')
  /**
  * @api {get} /api/v1/media/media-id  Get information about media object
  * @apiVersion 1.0.0
  * @apiName GetMedia
  * @apiGroup Media
  */
  .get(validate(paramValidation.get), mediaCtrl.get)
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
router.post('/', validate(paramValidation.create), mediaCtrl.create);

/**
* @api {get} /api/v1/media/search Search for recent media in a given area.
* @apiVersion 1.0.0
* @apiName SearchMedia
* @apiGroup Media
*/
router.get('/search', validate(paramValidation.search), mediaCtrl.search);

/** Load media when API with id route parameter is hit */
router.param('id', mediaCtrl.load);

export default router;
