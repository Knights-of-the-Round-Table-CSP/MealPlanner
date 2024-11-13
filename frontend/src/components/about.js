import React, { useState } from "react";
import '../static/AboutPage.css'; 

const AboutPage = () => {

  return (
    <div className="about-page">

      <div className="about-section">
        <img src="path/to/image1.jpg" alt="Oleg" className="about-image" />
        <div className="about-text">
          <h2>Oleg</h2>
          <p>......................</p>
        </div>
      </div>

      <div className="about-section">
        <img src="path/to/image2.jpg" alt="Matti" className="about-image" />
        <div className="about-text">
          <h2>Matti</h2>
          <p>.........................</p>
        </div>
      </div>

      <div className="about-section">
        <img src="path/to/image3.jpg" alt="Sabina" className="about-image" />
        <div className="about-text">
          <h2>Sabina</h2>
          <p>...................</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
