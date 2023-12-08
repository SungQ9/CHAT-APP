import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

import "./Chat.css";

const ENDPOINT = "http://175.114.130.12:5000";

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);

    console.log(name, room);

    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    setRoom(room);
    setName(name);

    newSocket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      // Cleanup function to close the socket when the component unmounts
      newSocket.disconnect();
    };
  }, [ENDPOINT, window.location.search]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => {
      // Cleanup function to remove event listeners when the component unmounts
      socket.off("message");
      socket.off("roomData");
    };
  }, [socket]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      console.log(message);
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
