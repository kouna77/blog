import * as express from 'express'
import NotFoundException from '../exception/NotFoundException'
import Post from '../model/Post'
import AppApiDataResponse from '../response/AppApiDataResponse'
import Controller from './Controller'

export default class PostController extends Controller {
  static store (req: express.Request, res: express.Response, next: express.NextFunction) {
    new Post(req.body)
      .save()
      .then(post => res.json(new AppApiDataResponse({ data: post, message: `Post ${post.title} created.` })))
      .catch(error => next(error))
  }

  static index (req: express.Request, res: express.Response, next: express.NextFunction) {
    Post.find({})
      .then(posts => res.json(new AppApiDataResponse({ data: posts })))
      .catch(error => next(error))
  }

  static show (req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id
    Post.findById(id)
      .then((post: any) => {
        if (!post) {
          throw new NotFoundException({ message: 'Post not found' })
        }
        res.json(new AppApiDataResponse(({ data: post })))
      })
      .catch(error => next(error))
  }

  static update (req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id
    const data = req.body
    Post.findByIdAndUpdate(id, data, { new: false })
      .then(post => {
        if (!post) {
          throw new NotFoundException({ message: 'Post not found' })
        }
        res.send(new AppApiDataResponse({ data: post, message: `Post ${post.title} updated.` }))
      })
      .catch(error => next(error))
  }

  static destroy (req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id
    Post.findByIdAndDelete(id)
      .then(post => {
        if (!post) {
          throw new NotFoundException({ message: 'Post not found' })
        }
        res.json(new AppApiDataResponse({ data: post, message: `Post ${id} deleted.` }))
      })
      .catch((error) => next(error))
  }
}
