import PasswordController from '@/controller/PasswordController'
import authMiddleware from '@/middleware/auth.middleware'
import { Router } from 'express'

export default Router()
  .post('/forgot', PasswordController.forgot.bind(this))
  .put('/reset', authMiddleware, PasswordController.reset.bind(this))
