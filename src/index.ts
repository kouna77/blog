import 'module-alias/register'
import Database from '@/Database'
import { PORT } from './config'
import Server from './Server'

(async () => {
  const database = new Database()
  const server = new Server(PORT, database)
  await server.start()
})()
