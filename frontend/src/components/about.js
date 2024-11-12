// AboutPage.js
import React, { useState } from "react";
import ChatbotBubble from "./ChatbotBubble";
import ChatWindow from "./ChatWindow";

const AboutPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our website. We are a company dedicated to providing top-notch services.</p>

      {isChatOpen && <ChatWindow onClose={toggleChat} />}
      
      {!isChatOpen && <ChatbotBubble onClick={toggleChat} />}
    </div>
  );
};

export default AboutPage;
