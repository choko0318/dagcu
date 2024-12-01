// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// 회원가입
router.post("/signup", userController.signup);

// 로그인
router.post("/login", userController.login);

// 사용자 정보 조회 (인증 필요)
router.get("/user/me", authMiddleware, userController.getUserInfo);

// 사용자 정보 업데이트 (인증 필요)
router.put("/user/me", authMiddleware, userController.updateUserInfo);

// 졸업 통계 정보 조회 (인증 필요)
router.get(
  "/user/:studentID/graduation-stats",
  authMiddleware,
  userController.getGraduationStats
);

// 사용자의 수강 과목 목록 조회 (인증 필요)
router.get(
  "/user/:studentID/courses",
  authMiddleware,
  userController.getUserCourses
);

// 영어 점수 업데이트
router.put(
  "/update-english-score",
  authMiddleware, // 인증 미들웨어
  userController.updateEnglishScore // 영어 점수 업데이트 컨트롤러
);
module.exports = router;
