import AppException from './AppException'

export default class ValidationException extends AppException {
  constructor ({ data = {}, message = data[Object.keys(data)[0]] }) {
    super({ data, message, status: 422 })
  }
}
