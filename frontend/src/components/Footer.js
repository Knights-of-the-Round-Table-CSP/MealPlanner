// Footer.js
import React from 'react';
import '../static/footer.css'; // Import CSS if you'd like to style the footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Oleg Matti Sabina</p>
            </div>
        </footer>
    );
};

export default Footer;
