import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['IMAGE', 'VIDEO'],
    default: 'IMAGE'
  },
  caption: {
    type: String,
    required: false
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Statics
 */
MediaSchema.statics = {
  /**
   * Get Media
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<Media, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('_user')
      .execAsync()
      .then(media => {
        if (media) {
          return media;
        }
        const err = new APIError('No such media exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};


/**
 * @typedef Media
 */
export default mongoose.model('Media', MediaSchema);
