import { NextFunction, Response, Request } from 'express'

export default function errorMiddleware (error, request: Request, response: Response, next: NextFunction) {
  const message = error.message || 'Something went wrong'
  const data = error.data || error
  const status = error.status || 500
  return response
    .status(status)
    .json({
      type: 'error',
      message,
      data
    })
}
