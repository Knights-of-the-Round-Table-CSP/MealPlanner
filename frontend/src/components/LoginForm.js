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
          localStorage.setItem('access_token', access);
          localStorage.setItem('user_id', id);

          let userData = {
            accessToken: access,
            user: user
          }

          login(userData)
          navigate(`/prompt/${id}`); 
        } else {
          setError('Login failed.');
        }
      })
      .catch(error => {
        setError('Login failed:', error.message);
        setTimeout(() => setError(''), 1000);
      })

  };

  return (
    <div className="container">
      {error && <p className="error-message-login">Not vaild credentials</p>}
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
        Don't have an account? <br></br>
      </p>
      <a className="next-page-link" onClick={(e) => { e.preventDefault(); // Prevent default link behavior
      navigate('/signup');}}
      href="/signup"> Sign up</a>
      </form>
    </div>
  );
};

export default LoginForm;
