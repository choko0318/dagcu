const db = require("../models/db");

// 과목 목록 조회
exports.getCourses = async (req, res) => {
  const { courseNum, courseName } = req.query;
  let query = "SELECT * FROM Course WHERE 1=1";
  const params = [];

  // 대소문자 무시하고 부분 일치 검색
  if (courseNum) {
    query += " AND LOWER(CourseNum) LIKE ?";
    params.push(`%${courseNum.toLowerCase()}%`);
  }
  if (courseName) {
    query += " AND LOWER(CourseName) LIKE ?";
    params.push(`%${courseName.toLowerCase()}%`);
  }

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error("과목 목록 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 특정 과목 상세 조회
exports.getCourseByNum = async (req, res) => {
  const { courseNum } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM Course WHERE CourseNum = ?",
      [courseNum]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "과목을 찾을 수 없습니다." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("특정 과목 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 수강 과목 추가
exports.takeCourse = async (req, res) => {
  const { courseNum, yearTaken, semesterTaken, grade } = req.body;
  const studentID = req.user.studentID; // authMiddleware에서 설정한 사용자 정보

  console.log("req.user:", req.user);
  // 파라미터 값 로그 출력
  console.log("studentID:", studentID);
  console.log("courseNum:", courseNum);
  console.log("grade:", grade);
  console.log("yearTaken:", yearTaken);
  console.log("semesterTaken:", semesterTaken);
  try {
    // 필수값 기본값 설정
    const currentYear = new Date().getFullYear();
    const validYear = yearTaken || currentYear; // 기본값: 현재 연도
    const validSemester = semesterTaken || "1"; // 기본값: 1학기
    const validGrade = grade || "0"; // 기본값: 0

    // 학점 유효성 검사
    const gradePattern = /^[A-F][+-0]?$/;
    if (!gradePattern.test(validGrade) && validGrade !== "0") {
      return res
        .status(400)
        .json({ error: "유효한 학점을 입력해주세요 (예: A, B+, C-)" });
    }

    // 수강 연도 유효성 검사
    if (validYear < 2000 || validYear > currentYear) {
      return res.status(400).json({
        error: `유효한 수강 연도를 입력해주세요 (2000 ~ ${currentYear})`,
      });
    }

    // 수강 학기 유효성 검사
    if (!["1", "2"].includes(validSemester)) {
      return res
        .status(400)
        .json({ error: "유효한 수강 학기를 선택해주세요." });
    }

    // 과목 존재 여부 확인
    const [courseRows] = await db.execute(
      "SELECT * FROM Course WHERE CourseNum = ?",
      [courseNum]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({ error: "과목을 찾을 수 없습니다." });
    }

    // 이미 수강한 과목인지 확인
    const [takenRows] = await db.execute(
      "SELECT * FROM UserCourse WHERE StudentID = ? AND CourseNum = ?",
      [studentID, courseNum]
    );

    if (takenRows.length > 0) {
      return res.status(400).json({ error: "이미 수강한 과목입니다." });
    }

    // 수강 과목 추가
    await db.execute(
      "INSERT INTO UserCourse (StudentID, CourseNum, Grade, YearTaken, SemesterTaken) VALUES (?, ?, ?, ?, ?)",
      [studentID, courseNum, validGrade, validYear, validSemester]
    );

    res.status(201).json({ message: "수강 과목이 성공적으로 추가되었습니다." });
  } catch (error) {
    console.error("수강 과목 추가 오류:", error);
    res
      .status(500)
      .json({ error: "수강 과목을 추가하는 중 서버 오류가 발생했습니다." });
  }
};
