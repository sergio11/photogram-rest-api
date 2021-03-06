import Promise from 'bluebird';
import randtoken from 'rand-token';
import User from '../models/user';
import { sign } from 'jsonwebtoken';
import { secret, ttl, resetPasswordToken, env } from '../../config/env';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import * as codes from '../codes/';
import graph from 'fbgraph';

// promisify graph
Promise.promisifyAll(graph);

/**
 * Login User
 * @returns {User}
 */
export function login(req, res, next) {
  User.findOne({ username: req.body.username }).then(user =>	{
    if (!user) {
      throw new APIError(
        codes.LOGIN_FAIL,
        res.__('Username or password invalid.'),
        httpStatus.NOT_FOUND,
        true
       );
    }
    if (user.active === 0) {
      throw new APIError(
        codes.ACCOUNT_DISABLED,
        res.__('The account is disabled'),
        httpStatus.FORBIDDEN,
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
* Login User with facebook
* @returns {User}
*/

export function facebook(req, res, next) {
  const fbToken = req.body.token;
  graph.setVersion('2.7');
  graph.setAccessToken(fbToken);
  graph.getAsync(`/${req.body.id}`)
  .then(data => User.findOne({ fbID: data.id }).then(userSaved => {
    let user = userSaved;
    if (user) {
      user.set('fbToken', fbToken);
    } else {
      user = new User({
        fullname: data.name,
        username: data.name,
        email: data.email || 'sosos@usal.es',
        fbID: data.id,
        fbToken,
        active: 1
      });
    }
    return user.saveAsync();
  })
  .then(user => sign(user.id, secret))
  .then(token => {
    res.json({
      code: codes.LOGIN_SUCCESS_WITH_FACEBOOK,
      status: 'success',
      data: token
    });
  }).catch(err => {
    console.log(err);
    next(new APIError(
      codes.LOGIN_FAIL_WITH_FACEBOOK,
      res.__('Failure to sign in with facebook.'),
      httpStatus.INTERNAL_SERVER_ERROR,
      true
    ));
  }));
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
export function create(req, res, next) {
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
      data: {
        id: savedUser._id,
        message: res.__('User successfully registered, check your email for more information')
      }
    });
  }).catch(e => next(e));
}

/**
 * Load self user.
 */
export function self(req, res, next) {
  User.get(req.auth)
  .then(user => res.json({
    code: codes.USER_FOUND,
    status: 'success',
    data: {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      bio: user.biography,
      website: user.website,
      counts: {
        media: user._media.length,
        follows: user._follows.length,
        followed_by: user._followedBy.length
      }
    }
  }))
  .catch(() => {
    next(new APIError(codes.USER_NOT_FOUND, res.__('User not found'), httpStatus.NOT_FOUND, true));
  });
}

/**
 * Load user and append to req.
 */
export function load(req, res, next, id) {
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
export function get(req, res) {
  res.json({
    code: codes.USER_FOUND,
    status: 'success',
    data: {
      id: req.user._id,
      username: req.user.username,
      fullname: req.user.fullname,
      bio: req.user.biography,
      website: req.user.website,
      counts: {
        media: req.user._media.length,
        follows: req.user._follows.length,
        followed_by: req.user._followedBy.length
      }
    }
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
export function update(req, res, next) {
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
export function list(req, res, next) {
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
export function remove(req, res, next) {
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
export function follows(req, res, next) {
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
export function followedBy(req, res, next) {
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
export function follow(req, res, next) {
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
export function unfollow(req, res, next) {
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

/**
* Confirm User Accounts
*/
export function confirm(req, res, next) {
  User.findOneAndUpdate({ confirmationToken: req.params.token }, { active: 1 })
  .then(user => {
    if (!user) {
      throw new APIError(
        codes.INVALID_CONFIRMATION_TOKEN,
        res.__('Invalid confirmation token'),
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    } else {
      res.json({
        code: codes.ACCOUNT_ACTIVATED,
        status: 'success',
        data: res.__('The account was successfully activated')
      });
    }
  })
  .catch(e => next(e));
}

/**
* Send token for reset to user email
*/
export function resetPasswordRequest(req, res, next) {
  User.findOne({ email: req.body.email }).then(user =>	{
    if (!user) {
      throw new APIError(
        codes.NO_SUCH_USER_EXIST,
        res.__('No such user exists'),
        httpStatus.NOT_FOUND,
        true
      );
    }
    // No permitimos solicitud de restablecimiento si esta no ha expirado.
    if (user.passwordRequestedAt &&
      new Date(user.passwordRequestedAt).getTime() + ttl > (new Date()).getTime()) {
      throw new APIError(
        codes.PASSWORD_ALREDY_REQUEST,
        res.__('The password for this user has already been requested within 24 hours'),
        httpStatus.BAD_REQUEST,
        true
      );
    }
    // reset password
    user.set('passwordRequestedAt', new Date());
    if (!user.confirmationToken) {
      if (env === 'test') {
        user.set('confirmationToken', resetPasswordToken);
      } else {
        user.set('confirmationToken', randtoken.generate(16));
      }
    }
    return user.saveAsync();
  }).then(savedUser => {
    res.json({
      code: codes.PASSWORD_RESET_REQUEST_MADE,
      status: 'success',
      data: res.__('We have sent an email to %s', savedUser.email)
    });
  }).catch(e => next(e));
}

/*
* Reset user password
*/
export function resetPassword(req, res, next) {
  User.findOneAndUpdate({
    confirmationToken: req.params.token
  }, {
    password: req.body.password,
    passwordRequestedAt: null
  })
  .then(user => {
    if (!user) {
      throw new APIError(
        codes.INVALID_CONFIRMATION_TOKEN,
        res.__('Invalid confirmation token'),
        httpStatus.BAD_REQUEST,
        true
      );
    } else {
      res.json({
        code: codes.PASSWORD_SUCCESSFULLY_RESET,
        status: 'success',
        data: res.__('Password successfully reset')
      });
    }
  })
  .catch(e => next(e));
}
