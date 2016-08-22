import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validations/account';
import userCtrl from '../controllers/user';

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
*         "_id" : "57baccc875218f170f963d78",
*         "fullname": "Sergio Sánchez Sánchez",
*         "username": "Sergio11",
*         "biography": "Sergio es DIOS",
*         "email": "sss4esob@gmail.com",
*         "mobileNumber": "673445695",
*         "__v" : 0
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

export default router;
