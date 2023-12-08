import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

import "./Chat.css";

// 서버의 IP 주소
const ENDPOINT = "http://175.114.130.12:5000";

const Chat = ({ location }) => {
  // 상태 변수들
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  // 컴포넌트가 처음 마운트될 때 실행되는 효과
  useEffect(() => {
    // URL에서 name과 room을 가져옵니다.
    const { name, room } = queryString.parse(window.location.search);

    // 콘솔에 name과 room 출력
    console.log(name, room);

    // 새로운 소켓 인스턴스 생성
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // name과 room을 상태 변수에 설정
    setRoom(room);
    setName(name);

    // 서버에 join 이벤트를 전송
    newSocket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, [ENDPOINT, window.location.search]);

  // 메시지 및 사용자 업데이트를 처리하는 효과
  useEffect(() => {
    // 소켓이 없으면 종료
    if (!socket) return;

    // 서버로부터 메시지 이벤트를 수신하면 메시지 업데이트
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    // 서버로부터 roomData 이벤트를 수신하면 사용자 업데이트
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
    return () => {
      socket.off("message");
      socket.off("roomData");
    };
  }, [socket]);

  // 메시지를 전송하는 함수
  const sendMessage = (event) => {
    event.preventDefault();

    // 메시지가 비어 있지 않으면 소켓을 통해 sendMessage 이벤트 전송
    if (message) {
      console.log(message);
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  // 채팅 컴포넌트 렌더링
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
