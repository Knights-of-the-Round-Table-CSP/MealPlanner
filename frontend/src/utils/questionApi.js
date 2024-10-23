import axiosInstance from './axiosInstance'

class QuestionsApiService {
  constructor() {
    this.api = axiosInstance
  }

  list() {
    return this.api.get('api/questions/');
  }

  add(question) {
    let data = { 
        question: question 
    }

    return this.api.post('api/questions/', data)
  }
}

// Export an instance of the QuestionsApiService
const questionsApiService = new QuestionsApiService();
export default questionsApiService;