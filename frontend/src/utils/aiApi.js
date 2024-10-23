import axiosInstance from './axiosInstance'

class AIApiService {
  constructor() {
    this.api = axiosInstance
  }

  generateResponse(request) {
    return this.api.post('ai/send/', request)
  }
}

// Export an instance of the QuestionsApiService
const aiApiService = new AIApiService();
export default aiApiService;