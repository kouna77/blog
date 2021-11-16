import { IUser, UserRole } from '@/model/interfaces'

export default class UserPolicy {
  public static canFetchUsers (user: IUser): Boolean {
    return user.role === UserRole.ADMIN
  }

  public static canShowUser (user: IUser, id: string): Boolean {
    return user.id == id || user.role === UserRole.ADMIN
  }

  public static canUpdateUser (u: IUser, id: string): Boolean {
    return u.id === id || u.role === UserRole.ADMIN
  }

  public static canDeleteUser (user: IUser, id: string): Boolean {
    return user.role === UserRole.ADMIN
  }
}
