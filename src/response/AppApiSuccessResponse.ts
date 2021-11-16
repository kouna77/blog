import AppApiResponse from './AppApiResponse'

export default class AppApiSuccessResponse extends AppApiResponse {
  constructor ({ data, message }) {
    super({ data, type: AppApiResponse.TYPE_SUCCESS, message })
  }
}
