import * as faker from 'faker'
import omit from 'lodash/omit'
import { range } from '@/helper/app.helpers'
import { IUser, UserRole } from '@/model/interfaces'
import UserRepository from '../repository/UserRepository'
import AppFactory from './AppFactory'

const PASSWORD = 'secret'

export default class UserFactory extends AppFactory {
  public static async make (options: any = {}): Promise<IUser> {
    const password: string = PASSWORD

    const defaultOptions = {
      id: options.id || faker.random.uuid(),
      first_name: options.first_name || faker.name.firstName(),
      last_name: options.last_name || faker.name.lastName(),
      email: options.email || faker.internet.email(),
      password: options.password || password,
      password_confirmation: options.password_confirmation || password,
      role: options.role || UserRole.CUSTOMER,
      token: options.token || faker.random.uuid()
    }
    return Object.assign({}, defaultOptions, options)
  }

  public static async create (options: any = {}): Promise<IUser> {
    const payload = await UserFactory.make(options)
    return await UserRepository.add(omit(payload, ['password_confirmation']))
  }

  public static createMany (options: any = {}, count = 1): Promise<IUser[]> {
    return Promise.all(range(1, count)
      .map(_ => UserFactory.create(options)))
  }
}
