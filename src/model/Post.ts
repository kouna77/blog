import mongoose from 'mongoose'
import { IPost } from './interfaces'

const userSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Post = mongoose.model<IPost>('Post', userSchema)

export default Post
