import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  _media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  _from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Statics
 */
CommentSchema.statics = {
  /**
   * Get Media
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<Media, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('_media')
      .execAsync()
      .then(comment => {
        if (!comment) {
          return Promise.reject(new Error('No such Comment'));
        }
        return comment;
      });
  },
  /**
   * Get Comments Media Count
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<Integer, APIError>}
   */
  getCommentsCountForMedia(id) {
    return this.count({ _media: id })
    .execAsync()
    .then(count => ({ comments: count }));
  },
  /**
   * Get Media Comments
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<Array[Comment], APIError>}
   */
  getCommentsForMedia(id) {
    return this.find({ _media: id })
    .execAsync()
    .then(comments => {
      if (!comments || !comments.length) {
        throw new Error('No such comments for media!');
      }
      return comments;
    });
  }
};

/**
 * @typedef Comment
 */
export default mongoose.model('Comment', CommentSchema);
