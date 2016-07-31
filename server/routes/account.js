import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/login')
  /** POST /accounts/login - login user */
  .post(validate(paramValidation.login), userCtrl.login);

export default router;
