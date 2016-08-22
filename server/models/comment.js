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
  _form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Statics
 */
CommentSchema.statics = {
  /**
   * Get Comments Media Count
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<Integer, APIError>}
   */
  getCommentsCountForMedia(id) {
    return this.aggregate({
      $match: { _media: id },
      $group: {
        _media: id,
        count: {
          $sum: 1
        }
      }
    })
    .execAsync()
    .then(groups => {
      if (!groups || !groups.length) {
        return Promise.reject(new Error('No such comments for media!'));
      }
      return groups;
    });
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
