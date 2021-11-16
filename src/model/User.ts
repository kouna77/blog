import mongoose from 'mongoose'
import { IUser } from './interfaces'

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  token: String,
  role: String
})

userSchema.set('toJSON', {
  transform: (document, { __v, _id, ...rest }, options) => {
    return {
      ...rest, id: _id
    }
  }
})

const FILLABLES = ['first_name', 'last_name', 'email']

const User = mongoose.model<IUser>('User', userSchema)

export const RULES = {
  first_name: 'required',
  last_name: 'required',
  email: ['required', 'unique:Users'],
  password: ['required', 'confirmed']
}

export const EDIT_RULES = {
  first_name: 'required',
  last_name: 'required',
  email: ['required', 'unique:Users']
}

export default User
