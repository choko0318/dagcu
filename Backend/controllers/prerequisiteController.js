const db = require("../models/db");

// 선이수 과목 조회
exports.getPrerequisiteCourses = async (req, res) => {
  try {
    // 모든 선이수 과목 데이터를 가져옴
    const [rows] = await db.execute(`
      SELECT pc.CourseNum, pc.PrerequisiteCourseNum, c.CourseName AS PrerequisiteCourseName
      FROM PrerequisiteCourses pc
      JOIN Course c ON pc.PrerequisiteCourseNum = c.CourseNum
    `);

    // 응답 데이터
    res.json(rows);
  } catch (error) {
    console.error("Error fetching prerequisite courses:", error);
    res.status(500).json({ error: "Failed to fetch prerequisite courses" });
  }
};
