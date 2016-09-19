import Promise from 'bluebird';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import randtoken from 'rand-token';
import { env, activateToken } from '../../config/env';

// promisify bcrypt
Promise.promisifyAll(bcrypt);
require('mongoose-type-url');
require('mongoose-type-email');

const SALT_WORK_FACTOR = 10;
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: false
  },
  website: {
    type: mongoose.SchemaTypes.Url,
    required: false
  },
  biography: {
    type: String,
    required: false
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true
  },
  mobileNumber: {
    type: String,
    required: false,
    match: [/^[1-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  _media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  _follows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  _followedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  fbID: {
    type: Number,
    required: false,
    unique: true,
    sparse: true
  },
  fbToken: {
    type: String,
    required: false
  },
  active: {
    type: Number,
    required: true,
    default: 0
  },
  // Random string sent to the user email address in order to verify it
  confirmationToken: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  }
});


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  bcrypt.genSaltAsync(SALT_WORK_FACTOR)
    .then(result => bcrypt.hashAsync(user.password, result))
    .then(hash => {
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    })
    .catch(err => {
      next(err);
    });
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (user.active === 0) {
    if (env === 'test') {
      user.confirmationToken = activateToken;
    } else {
      user.confirmationToken = randtoken.generate(16);
    }
  }
  next();
});


/**
 * Methods
 */
UserSchema.method({
  comparePassword: (password, candidatePassword) => bcrypt.compareAsync(candidatePassword, password)
});
/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync()
      .then(user => {
        if (!user) {
          return Promise.reject(new Error('No such user exists!'));
        }
        return user;
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .execAsync();
  },
  /**
   * Get user follows
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<[User], APIError>}
   */
  follows(id) {
    return this.findById(id)
      .populate('_follows')
      .execAsync()
      .then(user => {
        if (!user) {
          return Promise.reject(new Error('No such user exists!'));
        }
        return user._follows;
      });
  },
  /**
   * Get user followed by
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<[User], APIError>}
   */
  followedBy(id) {
    return this.findById(id)
      .populate('_followedBy')
      .execAsync()
      .then(user => {
        if (!user) {
          return Promise.reject(new Error('No such user exists!'));
        }
        return user._followedBy;
      });
  },
  /**
   * add follower to user followed
   * @param {ObjectId} follower - The objectId of follower.
   * @param {ObjectId} followed - The objectId of followed.
   * @returns {Promise<[User], APIError>}
   */
  addFollower(follower, followed) {
    return Promise.all([
      this.findById(follower).update({ $push: { _follows: followed } }).execAsync(),
      this.findById(followed).update({ $push: { _follows: followed } }).execAsync()
    ]).then(() => ({ follower, followed }));
  },
  /**
   * remove follower to user followed
   * @param {ObjectId} follower - The objectId of follower.
   * @param {ObjectId} followed - The objectId of followed.
   * @returns {Promise<[User], APIError>}
   */
  removeFollower(follower, followed) {
    return Promise.all([
      this.findById(follower).update({ $pull: { _follows: followed } }).execAsync(),
      this.findById(followed).update({ $pull: { _follows: followed } }).execAsync()
    ]).then(() => ({ follower, followed }));
  }
};
/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
