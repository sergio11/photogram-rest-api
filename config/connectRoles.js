import ConnectRoles from 'connect-roles';
import * as codes from '../server/codes/';
import APIError from '../server/helpers/APIError';
import httpStatus from 'http-status';

const user = new ConnectRoles({
  failureHandler: (req, res, action) => {
    throw new APIError(
      codes.ACCESS_DENIED,
      res.__('Access Denied - You don\'t have permission to: %s', action),
      httpStatus.FORBIDDEN,
      true
    );
  }
});

user.use('delete media', req => req.media._user._id.toString() === req.auth);

user.use(
  'delete comment',
  req => {
    const userObjectId = req.comment._media._user.toString();
    const commentOwnerId = req.comment._from.toString();
    return userObjectId === req.auth || commentOwnerId === req.auth;
  }
);

export default user;
