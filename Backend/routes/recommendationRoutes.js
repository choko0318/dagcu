const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const authMiddleware = require("../middlewares/authMiddleware");

// 추천 과목 조회
router.get("/", authMiddleware, recommendationController.getRecommendedCourses);

// 후수 과목 추천 조회
router.get(
  "/prerequisites",
  authMiddleware,
  recommendationController.getPrerequisiteRecommendations
);

module.exports = router;
