import mongoose from 'mongoose'
import { IComment } from './interfaces'

const commentSchema = new mongoose.Schema({
  content: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
})

const Comment = mongoose.model<IComment>('Comment', commentSchema)
export default Comment
