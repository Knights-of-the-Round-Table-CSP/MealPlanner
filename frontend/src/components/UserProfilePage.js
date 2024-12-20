import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userApiService from '../utils/userApi';
import { useUser } from '../context/UserContext'; 
import '../static/userProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams(); 
    const { login } = useUser();

    const [user, setUser] = useState({ email: null, first_name: null, last_name: null });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from the API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userApiService.profile();
                if (!response || !response.data) {
                    throw new Error('User data not found');
                }
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user data from API:', err);
                setError('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]); 

    const renderError = (errorMessage) => (
        <div className="error-container">
            <h1>Error</h1>
            <p>{errorMessage}</p>
            <button onClick={() => navigate('/login')}>Go to Login Page</button>
        </div>
    );

    const renderUserProfile = (user) => (
        <div className="user-profile-content">
            {user.email ? (
                <>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>First Name:</strong> {user.first_name || 'N/A'}</p>
                    <p><strong>Last Name:</strong> {user.last_name || 'N/A'}</p>
                    <button onClick={() => navigate(`/qa/${userId}`)}>Go to Q&A Page</button>
                </>
            ) : (
                <p>No user data available. You do not have permission to view this profile.</p>
            )}
        </div>
    );

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return renderError(error);
    }

    return (
        <div className="user-profile-container">
            <h1 className="profile-title">My Profile</h1>
            {renderUserProfile(user)}
        </div>
    ); 
};

export default UserProfile;
