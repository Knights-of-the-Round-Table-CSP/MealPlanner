import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onLogin } from '../utils/api'; // Import your API function
import { useUser } from '../context/UserContext'; 
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

    try {
      const data = await onLogin(email, password);
      if (data.message === 'Login Successful!') {
        login({ uniqueId: data.uniqueId }); // Assuming your API returns a uniqueId
        navigate(`/qa/${data.uniqueId}`);
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
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
