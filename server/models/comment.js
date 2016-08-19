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
   * @returns {Promise<Media, APIError>}
   */
  getCommentsCountForMedia(id) {
    return this.aggregate({
      $group: {
        _id: id,
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
  }
};

/**
 * @typedef Comment
 */
export default mongoose.model('Comment', CommentSchema);
