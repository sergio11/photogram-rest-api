import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/account';
import * as userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

/**
* @api {post} /api/v1/accounts/signin login user
* @apiVersion 1.0.0
* @apiName signin
* @apiGroup Accounts
* @apiParam {String} username Username.
* @apiParam {String} password User's password.
* @apiSuccess {String} token Access token.
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "code": "1000",
*       "status": "success",
*       "token": eyJhbGciOiJIUzI1NiJ9.U2VyZ2lvMTE.X8xCcmI0yqAGxIULFgSZv1_2JsxHR-Y9Ka5qzY1HJMU
*     }
* @apiError LOGIN_FAIL Username or password invalid.
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "code": "1005",
*       "status": "error",
*       "message": "Username or password invalid"
*     }
*/
router.post('/signin', validate(paramValidation.signin), userCtrl.login);

/**
* @api {post} /api/v1/accounts/signin/facebook login facebook
* @apiVersion 1.0.0
* @apiName signinFacebook
* @apiGroup Accounts
* @apiParam {String} token facebook access token.
* @apiSuccess {String} tokenApplication Access Token.
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "code": "1001",
*       "status": "success",
*       "token": eyJhbGciOiJIUzI1NiJ9.U2VyZ2lvMTE.X8xCcmI0yqAGxIULFgSZv1_2JsxHR-Y9Ka5qzY1HJMU
*     }
* @apiError LOGIN_FAIL_WITH_FACEBOOK Failure to sign in with facebook.
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "code": "1007",
*       "status": "error",
*       "message": "Failure to sign in with facebook"
*     }
*/
router.post('/signin/facebook', validate(paramValidation.facebook), userCtrl.facebook);

/**
* @api {post} /api/v1/accounts/sigup signup user
* @apiVersion 1.0.0
* @apiName signup
* @apiGroup Accounts
* @apiParam {User} user a user information.
* @apiSuccess {User} user a user information.
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "code": "2000",
*       "status": "success",
*       "data": {
*         "id" : "57baccc875218f170f963d78",
*          "message" : 'User successfully registered, check your email for more information'
*       }
*     }
* @apiError USER_ALREDY_EXISTS User alredy exists.
* @apiErrorExample Error-Response:
*     HTTP/1.1 400 Bad Request
*     {
*       "code": "2005",
*       "status": "error",
*       "message": "User alredy exists"
*     }
*/
router.post('/signup', validate(paramValidation.signup), userCtrl.create);

/**
* @api {post} /api/v1/accounts/confirm/:token confirm user account
* @apiVersion 0.0.1
* @apiName confirm
* @apiGroup Accounts
* @apiParam {String} token a user confirmation token.
* @apiSuccess {String} message a confirmation message.
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "code": "3000",
*       "status": "success",
*       "data": 'The account was successfully activated'
*     }
* @apiError INVALID_CONFIRMATION_TOKEN invalid confirmation token.
* @apiErrorExample Error-Response:
*     HTTP/1.1 400 Bad Request
*     {
*       "code": "3005",
*       "status": "error",
*       "message": "Invalid confirmation token"
*     }
*/
router.get('/confirm/:token', validate(paramValidation.confirm), userCtrl.confirm);
/**
* @api {post} /api/v1/accounts/reset-password reset password request
* @apiVersion 0.0.1
* @apiName reset-password
* @apiGroup Accounts
* @apiParam {String} email a user email for verification.
* @apiSuccess {String} message instructions to follow.
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "code": "1015",
*       "status": "success",
*       "data": 'We have sent an email to %s.
*        It contains an activation link for you to click to activate your account.'
*     }
* @apiError NO_SUCH_USER_EXIST The user for which the password reset is requested does not exist.
* @apiErrorExample Error-Response:
*     HTTP/1.1 404 Not Found
*     {
*       "code": "1016",
*       "status": "error",
*       "message": "No such user exists"
*     }
* @apiError PASSWORD_ALREDY_REQUEST The last request not expired yet.
* @apiErrorExample Error-Response:
*     HTTP/1.1 400 Bad Request
*     {
*       "code": "1014",
*       "status": "error",
*       "message": "The password for this user has already been requested within 24 hours"
*     }
*/
router.post('/reset-password', validate(paramValidation.reset), userCtrl.resetPassword);

export default router;
