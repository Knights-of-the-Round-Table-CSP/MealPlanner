import axiosInstance from './axiosInstance'

class ChatApiService {
  constructor() {
    this.api = axiosInstance
  }

  post(message, history, recipeId) {
    let payload = {
        message: message,
        recipeId: recipeId,
        history: history
    }

    return this.api.post('api/chat/', payload);
  }
}

const chatApiService = new ChatApiService();
export default chatApiService;