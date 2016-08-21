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

user.use('delete media', req => req.media._user.username === req.auth);

export default user;
