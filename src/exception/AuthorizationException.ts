import AppException from './AppException'

export default class AuthorizationException extends AppException {
  constructor ({ data = {}, message = 'You are not authorized.' } = {}) {
    super({ status: 403, message, data })
  }
}
