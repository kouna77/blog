import AppException from './AppException'

export default class NotFoundException extends AppException {
  constructor ({ message = '404 Not found', data = {}, status = 404 }) {
    super({ message, status, data })
  }
}
