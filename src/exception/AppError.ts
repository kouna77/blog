export default class AppError extends Error {
  protected statusCode: number
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }

  getStatusCode (): number {
    return this.statusCode
  }
}
