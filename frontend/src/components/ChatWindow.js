import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../static/ChatWindow.css";
import chatApiService from "../utils/chatApi";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { message: "Hello! How can I assist you today?", role: "model" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { recipeId } = useParams();

  const handleSend = async () => {
    let user_message = input
    
    setInput(""); 
    setMessages(prev => [...prev, { message: user_message, role: "user"}])
    setIsLoading(true);

    chatApiService.post(user_message.trim(), messages, recipeId) // should work now
      .then(resp => {
        if (resp.data) {
          let {response} = resp.data
          setMessages(prev => [...prev, { message: response, role: "model"}])
          console.log(recipeId)
        }
      })
      .catch(error => 
        setMessages(prev => [...prev, { message: "Error occured on generating response.", role: "model"}])
      )
      .finally(() => setIsLoading(false))
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
            className={message.role === "model" ? "bot-message" : "user-message"}
          >
            {message.message}
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
