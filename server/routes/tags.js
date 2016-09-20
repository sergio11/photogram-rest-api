import express from 'express';
import validate from 'express-validation';
import tagsCtrl from '../controllers/tags';
import tagsValidations from '../validations/tags';
import user from '../../config/connectRoles';

const router = express.Router();	// eslint-disable-line new-cap

/**
* @api {get} /api/v1/tags/slug  Get information about a tag object.
* @apiVersion 0.0.1
* @apiName GetTags
* @apiGroup Terms
*/
router.get('/:slug', tagsCtrl.get);
/**
* @api {delete} /api/v1/tags/slug  Delete term
* @apiVersion 0.0.1
* @apiName DeleteTerm
* @apiGroup Terms
*/
router.delete('/:slug', user.can('delete term'), tagsCtrl.remove);
/**
* @api {get} /api/v1/tags/slug/media/recent  Get a list of recently tagged media.
* @apiVersion 0.0.1
* @apiName GetRecentlyTaggedMedia
* @apiGroup Terms
*/
router.get('/:slug/media/recent', validate(tagsValidations.recently), tagsCtrl.recently);
/**
* @api {get} /api/v1/tags/search  Search for tags by name.
* @apiVersion 0.0.1
* @apiName SearchTerms
* @apiGroup Terms
*/
router.get('/search', validate(tagsValidations.search), tagsCtrl.search);
/**
* @api {post} /api/v1/tags/  Create new term
* @apiVersion 0.0.1
* @apiName CreateTerm
* @apiGroup Terms
*/
router.post('/', validate(tagsValidations.create), tagsCtrl.create);

/** Load tag when API with slug route parameter is hit */
router.param('slug', tagsCtrl.load);

export default router;
