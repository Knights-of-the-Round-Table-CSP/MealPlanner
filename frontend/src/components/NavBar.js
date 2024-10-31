// NavBar.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../static/NavBar.css'; // Import any styles you may want

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/prompt/:userId">Prompt</Link></li>
                <li><Link to="/myProfile/:userId">My Profile</Link></li>
                <li><Link to="/about">About</Link></li>

            </ul>
        </nav>
    );
};

export default NavBar;
