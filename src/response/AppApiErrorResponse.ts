import AppApiResponse from './AppApiResponse'

export default class AppApiErrorResponse extends AppApiResponse {
  constructor ({ data, message }) {
    super({ data, type: AppApiResponse.TYPE_ERROR, message })
  }
}
