import axiosInstance from './axiosInstance'

class AnswerApiService {
  constructor() {
    this.api = axiosInstance
  }

  listUserAnswers() {
    return this.api.get('api/answers/');
  }

  addUserAnswer(answer) {
    return this.api.post('api/answers/', answer)
  }

  changeUserAnswer(id, answer) {
    return this.api.put(`api/answer/${id}`, answer)
  }

  deleteUserAnswer(id) {
    return this.api.delete(`api/answer/${id}`)
  }
}

// Export an instance of the QuestionsApiService
const answersApiService = new AnswerApiService();
export default answersApiService;