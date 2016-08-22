import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/user';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /**
  * @api {get} /api/v1/users Get list of users.
  * @apiVersion 1.0.0
  * @apiName GetUsers
  * @apiGroup Users
  */
  .get(userCtrl.list);

router.route('/:id')
  /**
  * @api {get} /api/v1/users/:userId Get user.
  * @apiVersion 1.0.0
  * @apiName GetUserDetail
  * @apiGroup Users
  */
  .get(validate(paramValidation.get), userCtrl.get)
  /**
  * @api {put} /api/v1/users/:userId Update user.
  * @apiVersion 1.0.0
  * @apiName UdateUser
  * @apiGroup Users
  */
  .put(validate(paramValidation.updateUser), userCtrl.update)
  /**
  * @api {delete} /api/v1/users/:userId Delete user.
  * @apiVersion 1.0.0
  * @apiName DeleteUser
  * @apiGroup Users
  */
  .delete(validate(paramValidation.deleteUser), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('id', userCtrl.load);

export default router;
