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

  change(id, question) {
    let data = {
      question: question 
    }

    return this.api.put(`api/questions/${id}`, data)
  }

  delete(id) {
    return this.api.delete(`api/questions/${id}`)
  }
}

// Export an instance of the QuestionsApiService
const questionsApiService = new QuestionsApiService();
export default questionsApiService;