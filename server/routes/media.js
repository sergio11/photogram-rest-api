import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/media';
import mediaCtrl from '../controllers/media';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/:id')
  /** GET /media/media-id - Get information about media object */
  .get(validate(paramValidation.get), mediaCtrl.get);

/** POST /media- create media */
router.post('/', validate(paramValidation.create), mediaCtrl.create);

/** GET /media/search  Search for recent media in a given area. **/
router.get('/search', validate(paramValidation.search), mediaCtrl.search);

/** Load media when API with id route parameter is hit */
router.param('id', mediaCtrl.load);

export default router;
