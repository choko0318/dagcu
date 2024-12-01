const db = require("../models/db");

// 추천 과목 가져오기
exports.getRecommendedCourses = async (req, res) => {
  const studentID = req.user.studentID;

  try {
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

// 후수 과목 추천 가져오기
exports.getPrerequisiteRecommendations = async (req, res) => {
  const studentID = req.user.studentID;

  try {
    // 사용자 이수 과목 가져오기
    const [userCourses] = await db.execute(
      `SELECT CourseNum FROM UserCourse WHERE StudentID = ?`,
      [studentID]
    );
    const completedCourses = userCourses.map((course) => course.CourseNum);

    console.log("사용자가 이수한 과목:", completedCourses);

    if (completedCourses.length === 0) {
      return res.json([]); // 이수 과목이 없으면 빈 배열 반환
    }

    // 이수한 과목을 선수 과목으로 가지는 후수 과목 필터링
    const [recommendedCourses] = await db.execute(
      `SELECT DISTINCT pc.CourseNum, c.CourseName, c.CourseType, c.IsCapstone, 
                      c.IsEnglishLecture, c.Credit, c.OfferedSemester
       FROM PrerequisiteCourses pc
       JOIN Course c ON pc.CourseNum = c.CourseNum
       WHERE pc.PrerequisiteCourseNum IN (${completedCourses
         .map(() => "?")
         .join(",")}) 
         AND pc.CourseNum NOT IN (${completedCourses
           .map(() => "?")
           .join(",")})`,
      [...completedCourses, ...completedCourses]
    );

    console.log("추천 후수 과목:", recommendedCourses);

    res.json(recommendedCourses);
  } catch (error) {
    console.error("후수 과목 추천 가져오기 오류:", error);
    res
      .status(500)
      .json({ error: "후수 과목 추천을 가져오는 중 오류가 발생했습니다." });
  }
};
