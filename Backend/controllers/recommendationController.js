// recommendationController.js
const db = require("../models/db");

// 추천 과목 가져오기
exports.getRecommendedCourses = async (req, res) => {
  try {
    const studentID = req.user.studentID; // 로그인한 사용자의 ID 가져오기

    // 사용자가 이미 수강한 과목 번호 가져오기
    const [takenCourses] = await db.execute(
      `SELECT CourseNum FROM UserCourse WHERE StudentID = ?`,
      [studentID]
    );
    const takenCourseNums = takenCourses.map((course) => course.CourseNum);

    // 전체 과목에서 수강한 과목 제외하기
    const [allCourses] = await db.execute(`SELECT * FROM Course`);
    const recommendedCourses = allCourses.filter(
      (course) => !takenCourseNums.includes(course.CourseNum)
    );

    res.json(recommendedCourses); // 추천 과목 리스트 반환
  } catch (error) {
    console.error("추천 과목 가져오기 오류:", error);
    res
      .status(500)
      .json({ error: "추천 과목을 가져오는 중 오류가 발생했습니다." });
  }
};
