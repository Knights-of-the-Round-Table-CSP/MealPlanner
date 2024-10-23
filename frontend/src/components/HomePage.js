// HomePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import userApiService from '../utils/userApi';
import '../static/HomeDesign.css'; 

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for the login button
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Hook to navigate between pages
    const { login } = useUser(); // Access the login function from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in both fields.'); // Basic validation
            return;
        }

        setLoading(true); // Start loading state
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

            setLoading(false); // Reset loading state after request
        })
        .catch(error => {
            setError('Login failed:', error.message);
            setLoading(false); // Reset loading state after request
        })
    };

    return (
        <div className="page-container">
            <h1>Welcome</h1>
            <div className="flex-container"> {/* Flex container for left and right sides */}
                <div className="left-side">
                    {/* This is where the image will be displayed */}
                </div>
                <div className="right-side">
                    <div className="login-box">
                        <h2>Login</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button> {/* Disable button while loading */}
                        </form>
    
                        {/* Sign Up Link */}
                        <div className="signup-option">
                            <p>
                                Don't have an account? 
                                <button 
                                    onClick={() => navigate('/signup')} 
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#1e88e5', 
                                        textDecoration: 'underline', 
                                        cursor: 'pointer' 
                                    }} 
                                >
                                    Sign up here
                                </button>
                            </p>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default HomePage;
