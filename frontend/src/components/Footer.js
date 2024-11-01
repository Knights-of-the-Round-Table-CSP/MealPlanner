// Footer.js
import React from 'react';
import '../static/footer.css'; // Import CSS if you'd like to style the footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Oleg Matti Sabina</p>
                <ul className="footer-links">
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
