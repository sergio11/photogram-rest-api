import User from '../models/user';
import { sign } from 'jsonwebtoken';
import { secret } from '../../config/env';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import * as codes from '../codes/';

/**
 * Login User
 * @returns {User}
 */
function login(req, res, next) {
  User.findOne({ username: req.body.username }).then(user =>	{
    if (!user) {
      throw new APIError(
        codes.LOGIN_FAIL,
        res.__('Username or password invalid.'),
        httpStatus.NOT_FOUND,
        true
       );
    }
    return user.comparePassword(user.password, req.body.password).then(isMatch => {
      if (!isMatch) {
        throw new APIError(
          codes.LOGIN_FAIL,
          res.__('Username or password invalid.'),
          httpStatus.NOT_FOUND,
          true
        );
      }
      return sign(user.id, secret);
    });
  }).then(token => {
    res.json({
      code: codes.LOGIN_SUCCESS,
      status: 'success',
      data: token
    });
  }).catch(e => next(e));
}

/**
 * Create new user
 * @property {string} req.body.fullname - The user's fullname
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The user's password.
 * @property {url} req.body.website - The user's website.
 * @property {biography} req.body.biography - The user's biography
 * @property {email} req.body.email - The user's email
 * @property {mobileNumber} req.body.mobileNumber - The user's mobileNumber
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password,
    website: req.body.website,
    biography: req.body.biography,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber
  });

  User.findOne({ email: user.email }).then(savedUser =>	{
    if (savedUser) {
      throw new APIError(
        codes.USER_ALREDY_EXISTS,
        res.__('User alredy exists'),
        httpStatus.BAD_REQUEST,
        true
      );
    }
    return user.saveAsync();
  }).then(savedUser => {
    res.json({
      code: codes.CREATE_USER_SUCCESS,
      status: 'success',
      data: savedUser
    });
  }).catch(e => next(e));
}

/**
 * Load self user.
 */
function self(req, res, next) {
  User.get(req.auth).then(user => {
    res.json({
      code: codes.USER_FOUND,
      status: 'success',
      data: user
    });
  }).catch(e => {
    console.log(e);
    next(new APIError(codes.USER_NOT_FOUND, res.__('User not found'), httpStatus.NOT_FOUND, true));
  });
}

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id).then((user) => {
    req.user = user;		// eslint-disable-line no-param-reassign
    return next();
  }).catch(() => {
    next(new APIError(codes.USER_NOT_FOUND, res.__('User not found'), httpStatus.NOT_FOUND, true));
  });
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  res.json({
    code: codes.USER_FOUND,
    status: 'success',
    data: req.user
  });
}

/**
 * Update self
 * @property {string} req.body.fullname - The user's fullname
 * @property {string} req.body.username - The username of user.
 * @property {url} req.body.website - The user's website.
 * @property {biography} req.body.biography - The user's biography
 * @property {email} req.body.email - The user's email
 * @property {mobileNumber} req.body.mobileNumber - The user's mobileNumber
 * @returns {User}
 */
function update(req, res, next) {
  User.get(req.auth).then(user => {
    user.set('fullname', req.body.fullname);
    user.set('username', req.body.username);
    user.set('website', req.body.website);
    user.set('biography', req.body.biography);
    user.set('email', req.body.email);
    user.set('mobileNumber', req.body.mobileNumber);
    return user.saveAsync();
  }).then(savedUser => res.json({
    code: codes.UPDATE_USER_SUCCESS,
    status: 'success',
    data: savedUser
  }))
  .catch(e => {
    next(new APIError(
      codes.UPDATE_USER_FAIL,
      res.__('User update failed'),
      httpStatus.INTERNAL_SERVER_ERROR,
      true
    ));
    console.log(e);
  });
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip }).then(users =>	res.json({
    code: codes.USER_LIST,
    status: 'success',
    data: users
  }))
  .catch(e => next(e));
}

/**
 * Delete self.
 * @returns {User}
 */
function remove(req, res, next) {
  User.get(req.auth).then(user => user.removeAsync())
  .then(deletedUser => res.json({
    code: codes.USER_DELETED,
    status: 'success',
    data: deletedUser
  }))
  .catch(e => next(e));
}

/**
* Get the list of users this user follows
* @returns {[User]}
*/
function follows(req, res, next) {
  User.follows(req.auth).then(userFollows => {
    res.json({
      code: codes.USER_FOLLOWS,
      status: 'success',
      data: userFollows
    });
  }).catch(e => next(e));
}

/**
* Get the list of users this user is followed by.
* @returns {[User]}
*/
function followedBy(req, res, next) {
  User.followedBy(req.auth).then(usersfollowedBy => {
    res.json({
      code: codes.USER_FOLLOWED_BY,
      status: 'success',
      data: usersfollowedBy
    });
  }).catch(e => next(e));
}

/**
* Follow user
* @returns {Object}
*/
function follow(req, res, next) {
  if (req.user._id.toString() !== req.auth) {
    User.addFollower(req.auth, req.user._id)
    .then(result => res.json({
      code: codes.FOLLOWING_THE_USER,
      status: 'success',
      data: result
    }))
    .catch(e => {
      console.log(e);
      next(e);
    });
  } else {
    next(new APIError(
      codes.CAN_NOT_FOLLOW,
      res.__('You can not follow yourself'),
      httpStatus.BAD_REQUEST,
      true
    ));
  }
}
/**
* UnFollow user
* @returns {Object}
*/
function unfollow(req, res, next) {
  if (req.user._id.toString() !== req.auth) {
    User.removeFollower(req.auth, req.user._id)
    .then(result => res.json({
      code: codes.UNFOLLOWING_THE_USER,
      status: 'success',
      data: result
    }))
    .catch(e => {
      console.log(e);
      next(e);
    });
  } else {
    next(new APIError(
      codes.CAN_NOT_UNFOLLOW,
      res.__('You can not unfollow yourself'),
      httpStatus.BAD_REQUEST,
      true
    ));
  }
}

export default {
  self,
  load,
  get,
  create,
  update,
  list,
  remove,
  login,
  follows,
  followedBy,
  follow,
  unfollow
};
