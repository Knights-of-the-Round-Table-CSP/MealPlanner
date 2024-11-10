import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../static/NavBar.css'; // Import any styles you may want

const NavBar = () => {
    const userId = localStorage.getItem('user_id'); // Retrieve user ID from local storage
    console.log('Retrieved User ID:', userId);

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to={`/prompt/${userId}`}>Prompt</Link></li>
                <li><Link to={`/userProfile/${userId}`}>My Profile</Link></li>
                <li><Link to={`/groceryList`}>Grocery List</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;
