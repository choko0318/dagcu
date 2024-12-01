// server.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true, // 인증 정보(쿠키 등) 포함 여부
  })
);
app.use(express.json());
// server.js 또는 초기화 파일
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}
// 포트 설정
const PORT = process.env.PORT || 5001;

// 라우트 설정
const userRoutes = require("./routes/userRoutes");

const courseRoutes = require("./routes/courseRoutes");
const graduationRoutes = require("./routes/graduationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const prerequisiteRoutes = require("./routes/prerequisiteRoutes");
const calculationRoutes = require("./routes/calculationRoutes");
// app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/graduation", graduationRoutes);
app.use("/api/recommended-courses", recommendationRoutes);
app.use("/api/calculations", calculationRoutes);
app.use("/api/additional-calculations", calculationRoutes);
app.use("/api/prerequisite-courses", prerequisiteRoutes);
app.use("/api", userRoutes);
// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 선이수 과목 API 경로 추가
