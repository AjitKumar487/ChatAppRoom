import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const App = () => {
  const [Name, setName] = useState("");
  const [Room, setRoom] = useState("");
  const [show, setshow] = useState(false);
  const [CurrentMessage, setCurrentMessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  const socket = io.connect("http://localhost:3001");

  const joinRoom = () => {
    socket.emit("joinroom", Room);
    console.log(`${Name}  ${Room}`);
    setshow(true);
  };

  const sendMessage = async() => {
    const messageData = {
      room: Room,
      author: Name,
      message: CurrentMessage,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    }
    
    await socket.emit("send_message", messageData);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setmessageList((list) => [...list, data]);
    })
  }, [socket])
  
  return (
    <>
      {show ? (
        ""
      ) : (
        <div className="room-container">
          <h1 className="room-container-heading">Join a Room</h1>
          <input
            type="text"
            placeholder="Name..."
            className="room-container-input"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            className="room-container-input"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className="room-container-button" onClick={joinRoom}>
            JOIN
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-title">
          <h2 className="chat-title-heading">ChatApp</h2>
        </div>
        <div className="chat-body">
          {
            messageList.map((list) => {
              return (
                <div className={list.author == Name ? "chat-content-sender" : "chat-content-receiver"} id={list.author == Name ? "you" : "other"}>
                  <div className="chat-content-data">
                    <p>{list.message}</p>
                  </div>
                  <div className="chat-content-meta">
                    <p>{list.author}</p>
                    <p>{list.time}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-footer-input"
            placeholder="Type a message"
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button className="chat-footer-button" onClick={sendMessage}>SEND</button>
        </div>
      </div>
    </>
  );
};

export default App;
