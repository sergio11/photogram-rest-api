import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/user';
import * as userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/self')
  /**
  * @api {get} /api/v1/users/self Get information about the owner of the access_token.
  * @apiVersion 0.0.1
  * @apiName GetSelf
  * @apiGroup Users
  */
  .get(userCtrl.self)
  /**
  * @api {put} /api/v1/users/self Update self.
  * @apiVersion 0.0.1
  * @apiName UdateSelf
  * @apiGroup Users
  */
  .put(validate(paramValidation.updateUser), userCtrl.update)
  /**
  * @api {delete} /api/v1/users/self Delete self.
  * @apiVersion 1.0.0
  * @apiName DeleteSelf
  * @apiGroup Users
  */
  .delete(validate(paramValidation.deleteUser), userCtrl.remove);

/**
* @api {get} /api/v1/users/self/follows Get the list of users this user follows.
* @apiVersion 0.0.1
* @apiName GetUserFollows
* @apiGroup Users
*/
router.get('/self/follows', userCtrl.follows);
/**
* @api {get} /api/v1/users/self/followed-by Get the list of users this user is followed by.
* @apiVersion 0.0.1
* @apiName GetUserFollowedBy
* @apiGroup Users
*/
router.get('/self/followed-by', userCtrl.followedBy);

/**
* @api {get} /api/v1/users Get list of users.
* @apiVersion 1.0.0
* @apiName GetUsers
* @apiGroup Users
*/
router.get('/', userCtrl.list);

/**
* @api {get} /api/v1/users/:userId Get user.
* @apiVersion 1.0.0
* @apiName GetUserDetail
* @apiGroup Users
*/
router.get('/:id', userCtrl.get);
/**
* @api {put} /api/v1/users/:userId/follow Follow user.
* @apiVersion 0.0.1
* @apiName FollowUser
* @apiGroup Users
*/
router.put('/:id/follow', userCtrl.follow);
/**
* @api {put} /api/v1/users/:userId/unfollow unfollow user.
* @apiVersion 0.0.1
* @apiName UnFollowUser
* @apiGroup Users
*/
router.put('/:id/unfollow', userCtrl.unfollow);
/** Load user when API with userId route parameter is hit */
router.param('id', userCtrl.load);

export default router;
