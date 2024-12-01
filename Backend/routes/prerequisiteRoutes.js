const express = require("express");
const router = express.Router();
const prerequisiteController = require("../controllers/prerequisiteController");
const authMiddleware = require("../middlewares/authMiddleware");

// 선이수 과목 조회 API
router.get("/", authMiddleware, prerequisiteController.getPrerequisiteCourses);

module.exports = router;
