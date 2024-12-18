import axios from 'axios';

class UserApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000/auth', // Base URL for the API
    });
  }

  signUp(firstName, lastName, email, password) {
    let newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
    }

    return this.api.post('/register/', newUser);
  }

  logIn(email, password) {
    let request = {
        email: email, 
        password: password
    }

    return this.api.post('/login/', request);
  }

  profile() {
    let token = localStorage.getItem('access_token');
    
    return this.api.get('/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
 
}

const userApiService = new UserApiService();
export default userApiService;