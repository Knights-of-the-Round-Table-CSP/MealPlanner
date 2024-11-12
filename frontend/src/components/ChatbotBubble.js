// ChatbotBubble.js
import React from "react";
import "../static/ChatbotBubble.css";

const ChatbotBubble = ({ onClick }) => {
  return (
    <div className="chatbot-bubble" onClick={onClick}>
      <p>Need Help?</p>
    </div>
  );
};

export default ChatbotBubble;
