import { Router } from 'express'
import UserController from '../controller/UserController'
import authMiddleware from '../middleware/auth.middleware'
export default Router()
  .get('/', authMiddleware, UserController.index.bind(this))
  .post('/', UserController.store.bind(this))
  .post('/login', UserController.login.bind(this))
  .get('/logout', authMiddleware, UserController.logout.bind(this))
  .get('/:id([A-z0-9]+)', authMiddleware, UserController.show.bind(this))
  .put('/:id([A-z0-9]+)', authMiddleware, UserController.update.bind(this))
  .delete('/:id([A-z0-9]+)', authMiddleware, UserController.destroy.bind(this))
