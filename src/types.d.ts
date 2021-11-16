import { IUser } from './model/interfaces'

declare global{
  namespace Express {
    export interface Request {
      user: IUser
      isJson (): boolean
    }
  }
}
