// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // 디버깅용 로그

  if (!authHeader) {
    return res.status(401).json({ error: "인증 헤더가 없습니다." });
  }

  const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
  console.log("Token:", token); // 디버깅용 로그

  if (!token) {
    return res.status(401).json({ error: "토큰이 없습니다." });
  }

  // middlewares/authMiddleware.js
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verification Error:", err); // 디버깅용 로그
      return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
    }
    console.log("Decoded JWT payload:", user); // 디버깅용 로그

    req.user = user; // 토큰에서 추출한 사용자 정보를 req.user에 저장
    next();
  });
};

module.exports = authMiddleware;
