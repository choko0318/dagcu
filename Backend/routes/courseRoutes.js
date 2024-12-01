// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");

// 과목 목록 조회
router.get("/", authMiddleware, courseController.getCourses);

// 특정 과목 상세 조회
router.get("/:courseNum", authMiddleware, courseController.getCourseByNum);

// 수강 과목 추가
router.post("/take", authMiddleware, courseController.takeCourse);

module.exports = router;
