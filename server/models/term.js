import mongoose from 'mongoose';

const TermSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    required: true,
    index: { unique: true }
  },
  descripcion: {
    type: String
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Statics
 */
TermSchema.statics = {
  /**
   * Get Term
   * @param {String} s. - The term slug.
   * @returns {Promise<Term, APIError>}
   */
  get(slug) {
    return this.findOne({ slug })
      .execAsync()
      .then(term => {
        if (!term) {
          return Promise.reject(new Error('No such term exists!'));
        }
        return term;
      });
  },
  /**
   * Get Term where name like text
   * @param {String} text. - Text to search.
   * @returns {Promise<[Term], APIError>}
   */
  like(text) {
    return this.find({ name: new RegExp(text, 'i') })
    .execAsync()
    .then(terms => {
      if (!terms) {
        return Promise.reject(new Error('No term matches the query!'));
      }
      return terms;
    });
  }
};

/**
 * @typedef Term
 */
export default mongoose.model('Term', TermSchema);
