import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/user';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /**
  * @api {get} /api/users - Get list of users.
  * @apiName GetUsers
  * @apiGroup Users
  */
  .get(userCtrl.list);

router.route('/:id')
  /**
  * @api {get} /api/users/:userId - Get user.
  * @apiName GetUserDetail
  * @apiGroup Users
  */
  .get(validate(paramValidation.get), userCtrl.get)
  /**
  * @api {put} /api/users/:userId - Update user.
  * @apiName UdateUser
  * @apiGroup Users
  */
  .put(validate(paramValidation.updateUser), userCtrl.update)
  /**
  * @api {delete} /api/users/:userId - Delete user.
  * @apiName DeleteUser
  * @apiGroup Users
  */
  .delete(validate(paramValidation.deleteUser), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('id', userCtrl.load);

export default router;
