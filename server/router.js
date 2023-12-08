const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("서버가 실행중입니다");
});

module.exports = router;
