import Controller from '@/controller/Controller'
import AppException from "@/exception/AppException";
import AuthorizationException from "@/exception/AuthorizationException";
import ValidationException from '@/exception/ValidationException'
import PasswordRequestRepository from "@/repository/PasswordRequestRepository";
import UserRepository from '@/repository/UserRepository'
import AppApiDataResponse from '@/response/AppApiDataResponse'
import MailService from "@/service/MailService";
import Validator from '@bcdbuddy/validator'
import { NextFunction, Request, Response } from 'express'
import pick from 'lodash/pick'
import moment from "moment";
import { Container } from "typedi";

export default class PasswordController extends Controller {
  static async forgot (request: Request, response: Response, next: NextFunction) {
    try {
      const data = pick(request.body, ['email'])
      const v = await Validator.make({
        data,
        rules: {
          email: 'required'
        }
      })
      if (v.fails()) {
        throw new ValidationException({ data: v.getErrors() })
      }
      const users = await UserRepository.findAll({ email: data.email })
      let { 0: user } = users
      if (!user) {
        throw new AppException({
          status: 422,
          message: 'Email do not match any account.'
        })
      }

      // delete previous password requests
      await PasswordRequestRepository.delete({ user: user.id })
      const passwordRequest = await PasswordRequestRepository.add({
        user: user.id
      })
      const mailService = Container.get(MailService)
      await mailService.passwordForgot({
        user: user.toJSON(),
        clearToken: passwordRequest.token,
      })
      response.json(new AppApiDataResponse({ data: passwordRequest }))
    } catch (error) {
      next(error)
    }
  }

  static async reset (request: Request, response: Response, next: NextFunction) {
    try {
      const data = pick(request.body, ['token', 'email', 'password', 'password_confirmation'])
      const v = await Validator.make({
        data,
        rules: {
          email: 'required',
          token: 'required|exists:PasswordRequest',
          password: 'required|confirmed'
        },
        models: {
          PasswordRequest: PasswordRequestRepository
        }
      })
      if (v.fails()) {
        throw new ValidationException({ data: v.getErrors() })
      }
      let { 0: user } = await UserRepository.findAll({ email: data.email })
      const passwordRequest = await PasswordRequestRepository.find({
        user: user.id
      })
      if (moment().diff(passwordRequest.expired_at) >= 0) {
        throw new AuthorizationException({ message: 'Password request has expired' })
      }
      user = await UserRepository.reset(user.id, data)
      await PasswordRequestRepository.delete(passwordRequest.id)
      response.json(new AppApiDataResponse({
        data: user
      }))
    } catch (error) {
      next(error)
    }
  }
}
