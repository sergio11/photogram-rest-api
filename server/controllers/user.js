import User from '../models/user';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id).then((user) => {
    req.user = user;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
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

  user.saveAsync()
    .then((savedUser) => res.json(savedUser))
    .error(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.fullname - The user's fullname
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The user's password.
 * @property {url} req.body.website - The user's website.
 * @property {biography} req.body.biography - The user's biography
 * @property {email} req.body.email - The user's email
 * @property {mobileNumber} req.body.mobileNumber - The user's mobileNumber
 * @property {createdAt} req.body.createdAt - The user's createdAt
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.fullname = req.body.fullname;
  user.username = req.body.username;
  user.password = req.body.password;
  user.website = req.body.website;
  user.biography = req.body.biography;
  user.email = req.body.email;
  user.mobileNumber = req.body.mobileNumber;
  user.createdAt = req.body.createdAt;

  user.saveAsync()
    .then((savedUser) => res.json(savedUser))
    .error((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip }).then((users) =>	res.json(users))
    .error((e) => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.removeAsync()
    .then((deletedUser) => res.json(deletedUser))
    .error((e) => next(e));
}

/**
 * Login User
 * @returns {User}
 */
function login(req, res) {
  User.findOne({ username: req.body.username }).then((user) =>	{
    user.comparePassword(req.body.password).then(isMatch => {
      res.json({ isMatch });
    });
  });
}

export default { load, get, create, update, list, remove, login };
