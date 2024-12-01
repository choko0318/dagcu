// controllers/userController.js
const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 회원가입
exports.signup = async (req, res) => {
  const { studentID, name, password, affiliation, major } = req.body;

  try {
    // 필수 필드 확인
    if (!studentID || !name || !password || !affiliation || !major) {
      return res.status(400).json({ error: "모든 필수 필드를 입력해주세요." });
    }

    // 사용자 존재 여부 확인
    const [existingUser] = await db.execute(
      "SELECT * FROM UserList WHERE StudentID = ?",
      [studentID]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 학번입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // MajorClassification 결정 로직
    let majorClassification = "";
    if (studentID.length >= 4) {
      const firstTwoDigits = studentID.substring(2, 4); // 3번째와 4번째 문자
      majorClassification = `${firstTwoDigits}${affiliation}${major}`;
    } else {
      // 학번 길이가 부족한 경우 에러 반환
      return res.status(400).json({ error: "학번 형식이 올바르지 않습니다." });
    }

    // UserList 테이블에 사용자 추가
    await db.execute(
      "INSERT INTO UserList (StudentID, Name, Password) VALUES (?, ?, ?)",
      [studentID, name, hashedPassword]
    );

    // UserInfo 테이블에 사용자 정보 추가 (MajorClassification 포함)
    await db.execute(
      "INSERT INTO UserInfo (StudentID, Affiliation, Major, MajorClassification) VALUES (?, ?, ?, ?)",
      [studentID, affiliation, major, majorClassification]
    );

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { studentID, password } = req.body;
  try {
    // 사용자 조회
    const [rows] = await db.execute(
      "SELECT * FROM UserList WHERE StudentID = ?",
      [studentID]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: "존재하지 않는 학번입니다." });
    }

    const user = rows[0];

    // 비밀번호 검증
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { studentID: user.StudentID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "로그인 성공", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 사용자 정보 조회
exports.getUserInfo = async (req, res) => {
  const studentID = req.user.studentID;
  try {
    const [rows] = await db.execute(
      "SELECT ul.StudentID, ul.Name, ui.Affiliation, ui.Major, ui.ForeignLanguageScore, ui.MajorClassification FROM UserList ul JOIN UserInfo ui ON ul.StudentID = ui.StudentID WHERE ul.StudentID = ?",
      [studentID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 사용자 정보 업데이트
exports.updateUserInfo = async (req, res) => {
  const studentID = req.user.studentID;
  const { affiliation, major, foreignLanguageScore, majorClassification } =
    req.body;
  try {
    await db.execute(
      "UPDATE UserInfo SET Affiliation = ?, Major = ?, ForeignLanguageScore = ?, MajorClassification = ? WHERE StudentID = ?",
      [affiliation, major, foreignLanguageScore, majorClassification, studentID]
    );

    res.json({ message: "사용자 정보가 업데이트되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 졸업 통계 정보 조회
exports.getGraduationStats = async (req, res) => {
  const { studentID } = req.params;

  // 토큰에서 추출한 사용자 ID와 요청된 studentID가 일치하는지 확인
  if (req.user.studentID !== studentID) {
    return res.status(403).json({ error: "권한이 없습니다." });
  }

  try {
    // 사용자 정보 가져오기
    const [userRows] = await db.execute(
      "SELECT * FROM UserInfo WHERE StudentID = ?",
      [studentID]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const userInfo = userRows[0];

    // 졸업 요건 가져오기
    const [requirementRows] = await db.execute(
      "SELECT * FROM GraduationRequirement WHERE MajorClassification = ?",
      [userInfo.MajorClassification]
    );

    if (requirementRows.length === 0) {
      return res
        .status(404)
        .json({ error: "해당 전공의 졸업 요건을 찾을 수 없습니다." });
    }

    const graduationRequirement = requirementRows[0];

    // 사용자가 이수한 과목 가져오기
    const [courseRows] = await db.execute(
      `SELECT uc.CourseNum, c.CourseType, c.Credit, uc.Grade, c.IsEnglishLecture, c.IsCapstone
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ?`,
      [studentID]
    );

    // 졸업 통계 계산 로직 구현
    let earnedCredits = 0;
    let liberalArtsCredits = 0;
    let generalEducationCredits = 0;
    let majorCredits = 0;
    let gpaTotal = 0;
    let gradeCount = 0;
    let englishLectureCount = 0;
    let capstoneCourseCount = 0;
    let basicElectiveCredits = 0;

    for (const course of courseRows) {
      const credit = course.Credit;

      // 총 취득 학점
      earnedCredits += credit;

      // 학문교양 학점
      if (course.CourseType === "학문기초") {
        liberalArtsCredits += credit;
      }

      // 공통교양 학점
      if (course.CourseType === "공통교양") {
        generalEducationCredits += credit;
      }

      // 전공 학점
      if (course.CourseType === "전공") {
        majorCredits += credit;
      }

      // 기본소양 학점
      if (course.CourseType === "기본소양") {
        basicElectiveCredits += credit;
      }

      // 영어강의 수
      if (course.IsEnglishLecture) {
        englishLectureCount += 1;
      }

      // 종합설계 과목 수
      if (course.IsCapstone) {
        capstoneCourseCount += 1;
      }

      // GPA 계산 (성적이 있는 경우)
      if (course.Grade && course.Grade !== "P" && course.Grade !== "F") {
        const gradePoint = convertGradeToPoint(course.Grade);
        if (gradePoint !== null) {
          gpaTotal += gradePoint * credit;
          gradeCount += credit;
        }
      }
    }

    const gpa = gradeCount > 0 ? gpaTotal / gradeCount : 0;

    // 결과 반환
    const graduationStats = {
      earnedCredits,
      liberalArtsCredits,
      generalEducationCredits,
      majorCredits,
      gpa,
      englishLectureCount,
      capstoneCourseCount,
      basicElectiveCredits,
    };

    res.json(graduationStats);
  } catch (error) {
    console.error("졸업 통계 정보 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 사용자 수강 과목 목록 조회
exports.getUserCourses = async (req, res) => {
  const { studentID } = req.params;

  // 토큰에서 추출한 사용자 ID와 요청된 studentID가 일치하는지 확인
  if (req.user.studentID !== studentID) {
    return res.status(403).json({ error: "권한이 없습니다." });
  }

  try {
    const [rows] = await db.execute(
      `SELECT uc.CourseNum, c.CourseName, c.CourseType, c.IsCapstone, c.IsEnglishLecture, c.OfferedSemester, c.Credit, uc.Grade
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ?`,
      [studentID]
    );

    res.json(rows);
  } catch (error) {
    console.error("사용자 수강 과목 목록 조회 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

// 성적을 평점으로 변환하는 함수
function convertGradeToPoint(grade) {
  const gradeMap = {
    "A+": 4.5,
    A0: 4.0,
    "B+": 3.5,
    B0: 3.0,
    "C+": 2.5,
    C0: 2.0,
    "D+": 1.5,
    D0: 1.0,
    F: 0,
  };
  return gradeMap[grade] !== undefined ? gradeMap[grade] : null;
}
