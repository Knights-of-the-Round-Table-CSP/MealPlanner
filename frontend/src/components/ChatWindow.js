import React, { useState } from "react";
import "../static/ChatWindow.css";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput(""); 
      setIsLoading(true);

      setTimeout(() => {
        const botResponse = "This is a simulated response from the bot.";  
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, sender: "bot" },
        ]);
        setIsLoading(false); 
      }, 1500);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Chatbot</span>
        <button className="chat-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="chat-body">
        {messages.map((message, index) => (
          <p
            key={index}
            className={message.sender === "bot" ? "bot-message" : "user-message"}
          >
            {message.text}
          </p>
        ))}
        {isLoading && <p className="loading-message">Bot is typing...</p>}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
