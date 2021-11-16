import AppException from './AppException'

export default class AuthenticationException extends AppException {
  static DEFAULT_MESSAGE = 'You need to sign in first.'

  constructor ({ data = {}, message = AuthenticationException.DEFAULT_MESSAGE, status = 401 }) {
    super({ status, message, data })
  }
}
