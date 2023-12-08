const users = [];

// 사용자가 방에 참가할 때 호출되는 함수입니다.
const addUser = ({ id, name, room }) => {
  // 데이터 정리
  name = name.trim();
  room = room.trim();

  // 기존 사용자 확인
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  // 이름과 방을 유효성 검사합니다.
  if (!name || !room) return { error: "이름과 방이 필요해요." };

  // 사용자명 유효성 검사
  if (existingUser) {
    return { error: "이미 존재하는 이름입니다." };
  }

  // 사용자 저장
  const user = { id, name, room };
  users.push(user);

  return { user };
};

// 사용자가 방을 나갈 때 호출되는 함수입니다.
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// 사용자가 메시지를 보낼 때 호출되는 함수입니다.
const getUser = (id) => {
  return users.find((user) => user.id === id) || {};
};

// 사용자가 메시지를 보낼 때 호출되는 함수입니다.
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
