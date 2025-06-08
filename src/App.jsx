
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import "./App.css"
import { AiFillSun } from "react-icons/ai";

const socket = io("http://localhost:4000");


function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const[mode,setMode] = useState(true)

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setChat(prev => [...prev, data]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  const loginHandler = () => {
    if (username.trim() !== "") {
      setIsLoggedIn(true);
    }
  };

  const messageHandler = () => {
    if (message.trim() !== "") {
      socket.emit("chat_message", { username, text: message });
      setMessage("");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h3>Enter your username</h3>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <button onClick={loginHandler}>Join Chat</button>
      </div>
    );
  }

  return (
    <>
    
    <p className={'p-btn'} onClick={()=>{setMode(!mode)}} ><AiFillSun /></p>
    {mode?"": <body style={{background:"#0E121B", color:"white"}}></body>}
    <div className="di" >
      <div className="chat-messages">
        {chat.map((msg, i) => (
          <p key={i} className={msg.username === username ? "self" : ""}>
            <b>{msg.username}</b> {msg.text}
          </p>
        ))}
      </div>

      <div className="input-section">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') messageHandler();
          }}
        />
        <button onClick={messageHandler}>Send</button>
      </div>
    </div></>
  );
}

export default App;
