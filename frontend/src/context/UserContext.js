// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user information here
    const [accessToken, setAccessToken] = useState(null); // Store access token here

    const login = (userData) => {
        setUser(userData.user); // Set user data after successful login
        setAccessToken(userData.accessToken); // Store access token
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null); // Clear user data on logout
        setAccessToken(null); // Clear access token on logout
    };

    return (
        <UserContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
