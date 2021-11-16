export default class AppApiResponse {
  private readonly type: string
  private readonly data: any
  private readonly message: string
  public static readonly TYPE_SUCCESS = 'success'
  public static readonly TYPE_ERROR = 'error'

  constructor ({ data, type, message }) {
    this.type = type
    this.message = message
    this.data = data
  }

  toString () {
    return JSON.stringify({
      type: this.type,
      message: this.message,
      data: this.data
    })
  }

  static from (payload) {
    return new AppApiResponse(payload)
  }

  isSuccess () {
    return this.type === AppApiResponse.TYPE_SUCCESS
  }

  getData () {
    return this.data
  }
}
