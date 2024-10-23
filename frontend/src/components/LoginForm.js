import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import userApiService from '../utils/userApi';
import '../static/FormDesign.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser(); // Access the login function from context

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

      userApiService.logIn(email, password)
      .then(response => {
        console.log(response.data);

        let { data } = response;
        let { access, user } = data;
        let { id, email, first_name, last_name} = JSON.parse(user);

        if (access && user && id) {
          console.log('JWT Access Token:', access);
          // Store the token in localStorage or a cookie for future requests
          localStorage.setItem('access_token', access);

          let userData = {
            accessToken: access,
            user: user
          }

          login(userData)
          navigate(`/qa/${id}`);
        } else {
          setError('Login failed.');
        }
      })
      .catch(error => {
        setError('Login failed:', error.message);
      })

  };

  return (
    <div className="container">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
        <h2>Login</h2>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      </form>
    </div>
  );
};

export default LoginForm;
