import mongoose from 'mongoose'
import { IPasswordRequest } from './interfaces'

const passwordSchema = new mongoose.Schema({
  token: String,
  expired_at: mongoose.Schema.Types.Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

passwordSchema.set('toJSON', {
  transform: (document, { __v, _id, ...rest }, options) => {
    return {
      ...rest, id: _id
    }
  }
})

const PasswordRequest = mongoose.model<IPasswordRequest>('PasswordRequest', passwordSchema)

export default PasswordRequest
