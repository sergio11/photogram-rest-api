import Promise from 'bluebird';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// promisify bcrypt
Promise.promisifyAll(bcrypt);
const SALT_WORK_FACTOR = 10;
require('mongoose-type-url');
require('mongoose-type-email');
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
    required: true
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
    required: true,
    match: [/^[1-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    type: Date,
    default: Date.now
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
      .execAsync().then((user) => {
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
  }
};
/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
