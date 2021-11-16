import { range } from '@/helper/app.helpers'
import { IPasswordRequest, IUser } from '@/model/interfaces'
import UserRepository from "@/repository/UserRepository";
import * as faker from 'faker'
import PasswordRequestRepository from '../repository/PasswordRequestRepository'
import AppFactory from './AppFactory'

export default class PasswordRequestFactory extends AppFactory {
  public static async make (options: any = {}): Promise<IUser> {

    const defaultOptions = {
      token: options.token || faker.random.uuid(),
      user: null
    }
    if (!('user' in options)) {
      const users = await UserRepository.findAll()
      defaultOptions.user = faker.random.arrayElement(users.map(u => u.id))
    }
    return Object.assign({}, defaultOptions, options)
  }

  public static async create (options: any = {}): Promise<IPasswordRequest> {
    const payload = await PasswordRequestFactory.make(options)
    return PasswordRequestRepository.add(payload)
  }

  public static createMany (options: any = {}, count = 1): Promise<IPasswordRequest[]> {
    return Promise.all(range(1, count)
      .map(_ => PasswordRequestFactory.create(options)))
  }
}
