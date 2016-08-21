import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/account';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

/**
* @api {post} /accounts/signin login user
* @apiName signin
* @apiGroup Accounts
*/
router.post('/signin', validate(paramValidation.signin), userCtrl.login);

/**
* @api {post} /accounts/sigup signup user
* @apiName signup
* @apiGroup Accounts
*/
router.post('/signup', validate(paramValidation.signup), userCtrl.create);

export default router;
