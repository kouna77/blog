import cors from 'cors'
import express from 'express'
import * as http from 'http'
import { DEBUG } from './config'
import Database from './Database'
import errorMiddleware from './middleware/error.middleware'
import requestLoggerMiddleware from './middleware/request.logger.middleware'
import postRoutes from './routes/postRoutes'
import userRoutes from './routes/userRoutes'
import passwordRoutes from '@/routes/passwordRoutes'

export default class Server {
  private readonly port: number
  private readonly database: Database
  private instance: any

  constructor (port: number, database: Database) {
    this.port = port
    this.database = database
  }

  start (): Promise<http.Server> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.database.connect()
        const app = express()
        app.use(express.json())
        app.use(cors())
        if (DEBUG) {
          app.use(requestLoggerMiddleware)
        }

        // routes
        app.use('/user', userRoutes)
        app.use('/post', postRoutes)
        app.use('/password', passwordRoutes)

        // *** THIS MIDDLEWARE SHOULD ALWAYS BE CALLED AT LAST ***
        app.use(errorMiddleware)

        this.instance = await app.listen(this.port, async () => {
          console.info(`Blog app listening on ${this.port}`)
        })
        resolve(this.instance)
      } catch (error) {
        reject(error)
      }
    })
  }

  async stop () {
    return await Promise.all([
      this.database.close(),
      this.instance.close()
    ])
  }
}
