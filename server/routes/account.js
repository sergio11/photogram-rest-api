import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/account';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

/** POST /accounts/signin- login user */
router.post('/signin', validate(paramValidation.signin), userCtrl.login);
/** POST /accounts/sigup- signup user */
router.post('/signup', validate(paramValidation.signup), userCtrl.create);

export default router;
