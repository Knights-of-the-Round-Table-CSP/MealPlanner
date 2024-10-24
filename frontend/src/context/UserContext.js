// UserContext.js
import React, { createContext, useContext, useState } from 'react';
import userApiService from '../utils/userApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user information here

  const login = (userData) => {
    setUser(userData); // Set user data after successful login
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null); // Clear user data on logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
