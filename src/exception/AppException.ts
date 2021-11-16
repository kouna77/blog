export default class AppException extends Error {
  public status: number
  public message: string
  public data: any

  constructor ({ data = {}, message = 'Something went wrong', status = 500 }) {
    super(message)
    this.data = data
    this.status = status
    this.message = message
  }
}
