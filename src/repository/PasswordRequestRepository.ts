import AppException from "@/exception/AppException";
import { hash } from "@/helper/app.helpers";
import { IPasswordRequest } from "@/model/interfaces";
import PasswordRequest from "@/model/PasswordRequest";
import Repository from "@/repository/Repository";
import UserRepository from "@/repository/UserRepository";
import moment from 'moment'

export default class PasswordRequestRepository extends Repository {
  static add (payload): Promise<IPasswordRequest> {
    return new Promise(async (resolve, reject) => {
      try {
        const defaultOptions = {
          token: await hash(Date.now().toString()),
          expired_at: moment().add(6, 'hour').toISOString()
        }
        const request = new PasswordRequest({
          ...defaultOptions,
          ...payload
        })
        await request.save()
        resolve(request)
      } catch (error) {
        reject(error)
      }
    })
  }

  static findAll (query: { [key: string]: string } = {}): Promise<IPasswordRequest[]> {
    if (query.id) {
      query._id = query.id
      delete query.id
    }
    return new Promise((resolve, reject) => {
      PasswordRequest.find(query)
        .then((passwordRequests) => resolve(passwordRequests))
        .catch((error: Error) => reject(error))
    })
  }

  static find (query: { [key: string]: string } = {}): Promise<IPasswordRequest> {
    return new Promise((resolve, reject) => {
      this.findAll(query)
        .then((users) => {
          const { 0: user } = users
          if (!user) {
            throw new AppException({
              status: 404,
              message: 'No password request found.'
            })
          }
          resolve(user)
        })
        .catch((error: Error) => reject(error))
    })
  }

  static exists (filters): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.count(filters)
        .then(count => resolve(count > 0))
        .catch(error => reject(error))
    })
  }

  static count (filters): Promise<number> {
    return new Promise((resolve, reject) => {
      PasswordRequest.countDocuments(filters)
        .then(user => resolve(user))
        .catch(error => reject(error))
    })
  }


  static delete (filters): Promise<boolean> {
    return new Promise((resolve, reject) => {
      PasswordRequest.deleteOne(filters)
        .then((result) => {
          if (!result) {
            throw new AppException({
              message: `Error while deleting the password request(s)`
            })
          }
          // result.ok >= 1
          resolve(true)
        })
        .catch((error: Error) => reject(error))
    })
  }
}
