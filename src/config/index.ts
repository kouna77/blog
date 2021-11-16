import dotenv from 'dotenv'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '../test.env' : './.env' })

export const DEBUG = process.env.DEBUG === 'true'
export const NODE_ENV = String(process.env.NODE_ENV)
export const IN_TEST = NODE_ENV === 'test'
export const IN_PRODUCTION = NODE_ENV === 'production'
export const IN_DEVELOPMENT = NODE_ENV === 'development'
export const MONGO_URI = String(process.env.MONGO_URI)
export const PORT = Number(process.env.PORT ?? 4000)

export const APP_NAME = process.env.APP_NAME
export const APP_URL = process.env.APP_URL


export * from './mail'
