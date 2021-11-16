import { Document } from 'mongoose'

export enum UserRole {
  CUSTOMER='CUSTOMER',
  ADMIN='ADMIN'
}

export const userRoleValues = [UserRole.CUSTOMER, UserRole.ADMIN]

export interface IUser extends Document{
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  token: string
  role: UserRole
}

export interface IPost extends Document{
  title: string
  slug: string
  content: string
  user: string // user id
}

export interface IComment extends Document {
  content: string
  created_at: string
  user: string // user id
  post: string // post id
}

export interface IPasswordRequest extends Document {
  user: string,
  token: string,
  expired_at: string
}


export interface ISender {
  name: string,
  host: string,
  port: number,
  ccs?: string[],
  login: string,
  password: string,
  secured?: boolean
}
