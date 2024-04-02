const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

// Access Token 생성 함수 (임의의 방식으로 생성)
function generateAccessToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// 로그인 라우트 - Access Token 생성 후 쿠키에 저장
app.post("/login", (req, res) => {
  // 여기서는 간단하게 Access Token을 생성하여 쿠키에 저장하는 예시입니다.
  const accessToken = generateAccessToken();
  res.cookie("access_token", accessToken, { httpOnly: true });
  res.send("로그인이 성공적으로 처리되었습니다.");
});

// 프로필 라우트 - Access Token을 사용하여 프로필 데이터 반환
app.get("/profile", (req, res) => {
  // 쿠키에서 Access Token을 가져옵니다.
  const accessToken = req.cookies.access_token;

  // 만약 Access Token이 없다면, 로그인이 필요함을 알립니다.
  if (!accessToken) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  // 여기서는 간단히 Access Token을 확인하는 예시입니다.
  // 실제로는 데이터베이스나 다른 저장소에서 Access Token을 확인해야 합니다.
  // 여기서는 간단히 "인증 성공" 메시지를 반환합니다.
  res.send("프로필 데이터: 유저123");
});

// 로그아웃 라우트 - 쿠키에서 Access Token을 제거하여 로그아웃 처리
app.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.send("로그아웃이 성공적으로 처리되었습니다.");
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
