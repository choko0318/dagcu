// routes/calculationRoutes.js
const express = require("express");
const router = express.Router();
const calculationController = require("../controllers/calculationController");
const authMiddleware = require("../middlewares/authMiddleware");

// 특별 계산 결과 조회
router.get(
  "/:option",
  authMiddleware,
  calculationController.getAdditionalCalculations
);

module.exports = router;
