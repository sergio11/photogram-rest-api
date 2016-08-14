import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const MediaSchema = new mongoose.Schema({
 type: {
   type: String,
   enum : ['IMAGE', 'VIDEO'],
   default : 'IMAGE'
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
 user: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * @typedef Media
 */
export default mongoose.model('User', UserSchema);
