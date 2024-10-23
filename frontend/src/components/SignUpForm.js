import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../static/FormDesign.css';
import userApiService from '../utils/userApi';

const SignUpForm = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      setSuccessMessage('');
      return; // Exit early if passwords don't match
    }
    
    // Attempt to sign up the user
    userApiService.signUp(firstName, lastName, email, password)
      .then(response => {
        setSuccessMessage('Sign up successful! Please log in.');
        setErrorMessage('');
        
        // Reset form fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to login page after successful signup
        navigate('/login'); // Redirect to login
      })
      .catch(error => {
        setErrorMessage(error.message);
        setSuccessMessage('');
      });
  };

  return (
    <div className="container">
      <div className="form-box login-signup-form"> {/* New class added */}
      <h2 className="heading">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first-name">First name:</label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last name:</label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
