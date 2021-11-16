import AppException from '@/exception/AppException'
import AuthorizationException from '@/exception/AuthorizationException'
import ValidationException from '@/exception/ValidationException'
import { EDIT_RULES, RULES } from '@/model/User'
import UserPolicy from '@/policy/UserPolicy'
import UserRepository from '@/repository/UserRepository'
import AppApiDataResponse from '@/response/AppApiDataResponse'
import Validator from '@bcdbuddy/validator'
import { NextFunction, Request, Response } from 'express'
import pick from 'lodash/pick'
import Controller from './Controller'

export default class UserController extends Controller {
  static async store (request: Request, response: Response, next: NextFunction) {
    try {
      const data = pick(request.body, ['first_name', 'last_name', 'email', 'password', 'password_confirmation', 'token', 'role'])
      const validator = await Validator.make({
        data,
        rules: RULES,
        models: {
          Users: UserRepository
        }
      })
      if (validator.fails()) {
        throw new ValidationException({ data: validator.getErrors() })
      }
      const user = await UserRepository.add(data)
      response.json(new AppApiDataResponse({ data: user, message: `User ${user.first_name} created.` }))
    } catch (error) {
      next(error)
    }
  }

  static async index (request: Request, response: Response, next: NextFunction) {
    try {
      if (!UserPolicy.canFetchUsers(request.user)) {
        throw new AppException({ message: 'You are not authorized', status: 403 })
      }
      const users = await UserRepository.findAll()
      response.json(new AppApiDataResponse({ data: users }))
    } catch (error) {
      next(error)
    }
  }

  static async show (request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      if (!UserPolicy.canShowUser(request.user, id)) {
        throw new AppException({ message: 'You are not authorized', status: 403 })
      }
      const user = await UserRepository.find({ id })
      response.json(new AppApiDataResponse({ data: user }))
    } catch (error) {
      next(error)
    }
  }

  static async update (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    const data = pick(request.body, ['first_name', 'last_name', 'email'])
    try {
      if (!UserPolicy.canUpdateUser(request.user, id)) {
        throw new AuthorizationException()
      }
      const v = await Validator.make({
        data,
        rules: EDIT_RULES,
        models: {
          Users: UserRepository
        }
      })
      if (v.fails()) {
        throw new ValidationException({ data: v.getErrors() })
      }
      const user = await UserRepository.update(id, data)
      response.json(new AppApiDataResponse({
        data: user,
        message: `User ${user.first_name} updated.`
      }))
    } catch (error) {
      next(error)
    }
  }

  static async destroy (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    try {
      if (!UserPolicy.canDeleteUser(request.user, id)) {
        throw new AppException({ message: 'You are not authorized', status: 403 })
      }
      const user = await UserRepository.delete(id)
      response.json(new AppApiDataResponse({ data: user, message: `User ${id} deleted.` }))
    } catch (error) {
      next(error)
    }
  }

  static async login (request: Request, response: Response, next: NextFunction) {
    try {
      const data = pick(request.body, ['email', 'password'])
      const validator = await Validator.make({
        data,
        rules: {
          email: 'required',
          password: 'required'
        }
      })
      if (validator.fails()) {
        throw new ValidationException({ data: validator.getErrors() })
      }
      const authUser = await UserRepository.login(data)
      response.json(new AppApiDataResponse({ data: authUser, message: `Welcome ${data.email}. ` }))
    } catch (error) {
      next(error)
    }
  }

  static async logout (request: Request, response: Response, next: NextFunction) {
    try {
      const user = await UserRepository.logout(request.user.id)
      response.json(new AppApiDataResponse({ data: user, message: 'See you soon ' }))
    } catch (error) {
      next(error)
    }
  }
}
