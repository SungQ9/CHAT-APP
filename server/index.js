const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const cors = require("cors");
const router = require("./router");

// index.js
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

// 서버 포트 설정
const PORT = process.env.PORT || 5000;

// Express 애플리케이션 및 HTTP 서버 생성
const app = express();
const server = http.createServer(app);

// Socket.IO 서버 생성 및 CORS 설정
const io = socketio(server, {
  cors: {
    origin: "*", // 허용할 도메인
    methods: ["GET", "POST"],
  },
});

// CORS 미들웨어 및 라우터 등록
app.use(cors());
app.use(router);

// Socket.IO 이벤트 처리
io.on("connect", (socket) => {
  console.log("새로운 유저가 접속했습니다.");

  // join 이벤트 처리
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) callback({ error: "에러가 발생했습니다." });

    // 새로운 유저를 방에 추가하고 환영 메시지 전송
    socket.emit("message", {
      user: "관리자",
      text: `${user.name}님 ${user.room}에 오신 것을 환영합니다.`,
    });

    // 방에 속한 모든 유저에게 업데이트된 방 정보 전송
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // 소켓을 방에 조인
    socket.join(user.room);

    // 콜백 함수 호출
    callback();
  });

  // sendMessage 이벤트 처리
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    // 유효한 유저가 존재하면 해당 방에 메시지 전송
    if (user && user.name) {
      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
      });
    } else {
      console.error("Invalid user or user name is undefined:", user);
    }

    // 콜백 함수 호출
    callback();
  });

  // disconnect 이벤트 처리
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    // 유저가 퇴장하면 해당 방에 메시지 및 업데이트된 방 정보 전송
    if (user) {
      io.to(user.room).emit("message", {
        user: "관리자",
        text: `${user.name}님이 퇴장하셨습니다.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }

    console.log("유저가 나갔습니다.");
  });
});

// 서버 시작 및 포트 출력
server.listen(PORT, "0.0.0.0", () =>
  console.log(`서버가 ${PORT}에서 시작되었습니다.`)
);
