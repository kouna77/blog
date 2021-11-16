import mongoose from 'mongoose'
import { IN_TEST, MONGO_URI } from './config'
import UserRepository from './repository/UserRepository'

export default class Database {
  private readonly options
  private readonly onCloseListeners: Array<() => void> = []

  constructor (options = {}) {
    this.options = Object.assign({}, options)
  }

  connect () {
    return new Promise(async (resolve, reject) => {
      let uri
      if (IN_TEST) {
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        const mongo = new MongoMemoryServer()
        uri = await mongo.getConnectionString()
        this.onClose(() => mongo.stop())
      } else {
        uri = MONGO_URI
      }
      mongoose.set('useNewUrlParser', true)
      mongoose.set('useFindAndModify', false)
      mongoose.set('useCreateIndex', true)
      mongoose.set('useUnifiedTopology', true)
      try {
        console.log('trying to connect with uri %s', uri)
        const connection = await mongoose.connect(`${uri}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        })
        console.log(`MongoDB successfully connected to ${uri}`)
        resolve(connection)
      } catch (e) {
        mongoose.connection.on('error', error => {
          reject(error)
        })
      }
    })
  }

  onClose (listener) {
    this.onCloseListeners.push(listener)
  }

  close () {
    console.log('stopping db connection')
    for (const listener of this.onCloseListeners) {
      listener()
    }
    return mongoose.disconnect()
  }

  truncate () {
    return Promise.all([
      UserRepository.truncate()
    ])
  }
}
