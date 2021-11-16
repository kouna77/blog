import Database from "../src/Database";
import Server from '../src/Server'

export function getServer (database): Server {
  return new Server(9999, database)
}

export function getDatabase () {
  return new Database()
}
