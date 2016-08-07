import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap
// verify JWT
router.use(userCtrl.verifyToken);

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list);

router.route('/:id')
  /** GET /api/users/:userId - Get user */
  .get(validate(paramValidation.get), userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(validate(paramValidation.deleteUser), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('id', userCtrl.load);

export default router;
