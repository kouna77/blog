import PostController from '../controller/UserController'
import { Router } from 'express'

export default Router()
  .get('/', PostController.index.bind(this))
  .post('/', PostController.store.bind(this))
  .get('/:id([A-z0-9]+)', PostController.show.bind(this))
  .put('/:id([A-z0-9]+)', PostController.update.bind(this))
  .delete('/:id([A-z0-9]+)', PostController.destroy.bind(this))
