//useAuth.js

import { useNavigate } from 'react-router-dom';
import { signUp, login } from '../utils/api'; // Import API calls


export const useAuth = () => {
  const navigate = useNavigate();

  const handleSignUp = async (email, password) => {
    try {
      const data = await signUp(email, password);
      if (data.success) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      if (data.success) {
        alert(data.message);
        localStorage.setItem('uniqueId', data.uniqueId);
        navigate(`/qa/${data.uniqueId}`)
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  return { handleSignUp, handleLogin };
};
