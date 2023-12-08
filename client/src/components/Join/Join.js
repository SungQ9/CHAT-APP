import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">실시간 채팅방</h1>
        <div>
          <input
            placeholder="닉네임"
            className="joinInput"
            type="text"
            onChange={(event) => setName(event.target.value)}
          ></input>
        </div>
        <div>
          <input
            placeholder="방이름"
            className="joinInput mt-20"
            type="text"
            onChange={(event) => setRoom(event.target.value)}
          ></input>
        </div>
        <Link
          onClick={(event) => (!name || !room ? event.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className="button mt-20" type="submit">
            입장하기
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
