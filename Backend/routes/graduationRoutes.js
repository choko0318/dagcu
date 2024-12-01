// routes/graduationRoutes.js
const express = require("express");
const router = express.Router();
const graduationController = require("../controllers/graduationController");
const authMiddleware = require("../middlewares/authMiddleware");

// 테스트 라우트
router.get("/test", (req, res) => {
  res.json({ message: "Graduation route is working" });
});

// 졸업 요건 및 이수 현황 조회
router.get(
  "/details",
  authMiddleware,
  graduationController.getGraduationDetails
);
// routes/graduationRoutes.js
router.get(
  "/requirements",
  authMiddleware,
  graduationController.getGraduationRequirements
);
// 사용자 이수 과목 조회
router.get("/courses", authMiddleware, graduationController.getUserCourses);

module.exports = router;
