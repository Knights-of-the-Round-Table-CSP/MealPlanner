import React from 'react';
import { Link } from 'react-router-dom'; 
import '../static/NavBar.css'; 

const NavBar = () => {
    const userId = localStorage.getItem('user_id'); 
    console.log('Retrieved User ID:', userId);

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to={`/prompt/${userId}`}>Recipe</Link></li>
                <li><Link to={`/userProfile/${userId}`}>My Profile</Link></li>
                <li><Link to="/about">About Us</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;
