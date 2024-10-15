// HomePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onLogin as loginAPI } from '../utils/api'; 
import '../static/HomeDesign.css'; 

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for the login button
    const navigate = useNavigate(); // Hook to navigate between pages

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in both fields.'); // Basic validation
            return;
        }

        setLoading(true); // Start loading state
        try {
            const result = await loginAPI(email, password); // Call login API
            console.log('Login successful:', result);
            console.log(result)

            // Check the response to confirm login success
            if (result.message === 'Login Successful!') {
                // Redirect to the QA page after successful login
                navigate(`/qa/${result.uniqueId}`); // Change this to your desired route
            } else {
                alert('Login failed: ' + (result.message || 'Please try again.')); // Show any error message returned
            }
        } catch (error) {
            console.error('Login failed:', error); // Log any errors
            alert('Login failed. Please try again.'); // Notify user of failure
        } finally {
            setLoading(false); // Reset loading state after request
        }
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
