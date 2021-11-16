import AppException from '@/exception/AppException'
import { NextFunction, Request, Response } from 'express'
import UserRepository from '@/repository/UserRepository'

export default async function authMiddleware (request: Request, response: Response, next: NextFunction) {
  const token = String(request.headers.authorization ?? '')
    .replace('Bearer ', '')
  if (!token) {
    return next(new AppException({ status: 401, message: 'You need to login to access this resource.' }))
  }
  const users = await UserRepository.findAll({ token })
  if (users.length === 0) {
    return next(new AppException({ status: 401, message: 'No user found with that token, maybe expired.' }))
  }
  request.user = users[0]
  next()
}
