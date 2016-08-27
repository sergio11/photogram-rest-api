import mongoose from 'mongoose';

const MediaTaggedSchema = new mongoose.Schema({
  _term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term'
  },
  taggedAt: {
    type: Date,
    default: Date.now
  },
  _media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }
});

MediaTaggedSchema.index({ _term: 1, _media: 1 }, { unique: true });

/**
 * Statics
 */
MediaTaggedSchema.statics = {
  /**
   * Get Media Tagged Count
   * @param {ObjectId} id - The term's id.
   * @returns {Promise<Object, APIError>}
   */
  getMediaTaggedCount(id) {
    return this.count({ _term: id })
    .execAsync()
    .then(count => ({ media_count: count }));
  },
  /**
   * Get recently tagged media
   * @param {Integer} count - Count of tagged media to return.
   * @returns {Promise<[], APIError>}
   */
  getRecentlyTaggedMedia({ count = 10 }) {
    return this.find()
    .sort({ taggedAt: -1 })
    .count(count)
    .execAsync()
    .then(mediaTagged => {
      if (!mediaTagged) {
        return Promise.reject(new Error('No recently tagged media'));
      }
      return mediaTagged;
    });
  }
};

/**
 * @typedef MediaTagged
 */
export default mongoose.model('MediaTagged', MediaTaggedSchema);
