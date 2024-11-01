// HomePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import userApiService from '../utils/userApi';
import '../static/HomeDesign.css'; 

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in both fields.');
            return;
        }

        setLoading(true);
        userApiService.logIn(email, password)
            .then(response => {
                const { data } = response;
                const { access, user } = data;
                const { id, email, first_name, last_name } = JSON.parse(user);

                if (access && user && id) {
                    localStorage.setItem('access_token', access);

                    // Store complete user data including first and last names
                    let userData = {
                        accessToken: access,
                        user: {
                            id,
                            email,
                            first_name,
                            last_name,
                        }
                    };

                    login(userData); // Save user data to context
                    navigate(`/prompt/${id}`); 
                } else {
                    setError('Login failed.');
                    setTimeout(() => setError(''), 1000);
                }

                setLoading(false);
            })
            .catch(error => {
                setError('Login failed:', error.message);
                setLoading(false);
                setTimeout(() => setError(''), 1000);
            });
    };

    return (
        <div className="page-container">
            <h1>Welcome</h1>
            <div className="flex-container">
                <div className="left-side">
                    {/* Display image or other content */}
                </div>
                <div className="right-side">
                {error && <p className="error-message-login">Not vaild credentials</p>}
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
                            </button>
                        </form>
                        <div className="signup-option">
                            <p>
                                Don't have an account? <br></br><br></br>
                            </p>
                            <a className="next-page-link" onClick={(e) => {
                                e.preventDefault(); // Prevent default link behavior
                                navigate('/signup');
                            }}
                            href="/signup"> Sign up</a>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default HomePage;
