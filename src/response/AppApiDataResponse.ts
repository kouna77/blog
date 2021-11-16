import AppApiResponse from './AppApiResponse'

export default class AppApiDataResponse extends AppApiResponse {
  constructor ({ data, type = AppApiResponse.TYPE_SUCCESS, message = '' }) {
    super({ data, type, message })
  }
}
