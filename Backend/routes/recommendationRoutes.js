// routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const authMiddleware = require("../middlewares/authMiddleware");

// 추천 과목 조회
router.get("/", authMiddleware, recommendationController.getRecommendedCourses);

module.exports = router;
