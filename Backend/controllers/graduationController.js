// controllers/graduationController.js
const db = require("../models/db");

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

exports.getGraduationDetails = async (req, res) => {
  const studentID = req.user.studentID;
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
    const [grRows] = await db.execute(
      "SELECT * FROM GraduationRequirement WHERE MajorClassification = ?",
      [userInfo.MajorClassification]
    );
    if (grRows.length === 0) {
      return res.status(404).json({ error: "졸업 요건을 찾을 수 없습니다." });
    }
    const graduationRequirement = grRows[0];

    // 전체 취득 학점 계산
    const [creditsRows] = await db.execute(
      `SELECT SUM(c.Credit) AS TotalCreditsEarned
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ?`,
      [studentID]
    );
    const totalCreditsEarned = creditsRows[0].TotalCreditsEarned || 0;

    // 전공 학점 계산
    const [majorCreditsRows] = await db.execute(
      `SELECT SUM(c.Credit) AS TotalMajorCredits
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ? AND c.CourseType = '전공'`,
      [studentID]
    );
    const totalMajorCredits = majorCreditsRows[0].TotalMajorCredits || 0;
    console.log(`취득 전공 학점: ${totalMajorCredits}`);

    // 학문교양 학점 계산
    const [liberalArtsCreditsRows] = await db.execute(
      `SELECT SUM(c.Credit) AS TotalLiberalArtsCredits
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ? AND c.CourseType = '학문기초'`,
      [studentID]
    );
    const totalLiberalArtsCredits =
      liberalArtsCreditsRows[0].TotalLiberalArtsCredits || 0;
    console.log(`취득 학문기초 학점: ${totalLiberalArtsCredits}`);

    // 공통교양 학점 계산
    const [generalEducationCreditsRows] = await db.execute(
      `SELECT SUM(c.Credit) AS TotalGeneralEducationCredits
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ? AND c.CourseType = '공통교양'`,
      [studentID]
    );
    const totalGeneralEducationCredits =
      generalEducationCreditsRows[0].TotalGeneralEducationCredits || 0;
    console.log(`취득 공통교양 학점: ${totalGeneralEducationCredits}`);

    // **영어 강의 수 계산**
    const [englishLectureRows] = await db.execute(
      `SELECT COUNT(*) AS EnglishLectureCount
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ? AND c.IsEnglishLecture = 1`,
      [studentID]
    );
    const englishLectureCount = englishLectureRows[0].EnglishLectureCount || 0;
    console.log(`영어 강의 수: ${englishLectureCount}`);

    // **종합설계 과목 수 계산**
    const [capstoneCourseRows] = await db.execute(
      `SELECT COUNT(*) AS CapstoneCourseCount
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ? AND c.CourseName LIKE '%종합설계%'`,
      [studentID]
    );
    const capstoneCourseCount = capstoneCourseRows[0].CapstoneCourseCount || 0;
    console.log(`종합설계 과목 수: ${capstoneCourseCount}`);

    // GPA 계산
    const [gpaRows] = await db.execute(
      `SELECT uc.Grade, c.Credit
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ?`,
      [studentID]
    );

    let totalPoints = 0;
    let totalGpaCredits = 0;

    gpaRows.forEach((row) => {
      const gradeRaw = row.Grade;
      const grade = gradeRaw.trim().toUpperCase();
      const credit = row.Credit;

      const gradePoint = convertGradeToPoint(grade);

      if (gradePoint !== null) {
        totalPoints += gradePoint * credit;
        totalGpaCredits += credit;
      } else {
        console.log(
          `알 수 없는 성적 "${gradeRaw}"로 인해 GPA 계산에서 제외됨.`
        );
      }
    });

    const gpa = totalGpaCredits > 0 ? totalPoints / totalGpaCredits : null;

    // GPA를 소수점 둘째 자리까지 반올림
    const gpaRounded = gpa !== null ? Math.round(gpa * 100) / 100 : null;

    // 응답 데이터 구성
    const response = {
      graduationRequirement: {
        ...graduationRequirement,
        // 필요한 경우 영어 강의 및 종합설계 요건을 추가
        // EnglishLectureRequirement: graduationRequirement.EnglishLectureRequirement,
        CapstoneCourseRequirement:
          graduationRequirement.CapstoneCourseCount || 0,
      },
      progress: {
        totalCreditsEarned,
        majorCreditsEarned: totalMajorCredits,
        liberalArtsCreditsEarned: totalLiberalArtsCredits,
        generalEducationCreditsEarned: totalGeneralEducationCredits,
        gpa: gpaRounded !== null ? gpaRounded : "N/A",
        englishLectureCount,
        capstoneCourseCount,
      },
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};

exports.getUserCourses = async (req, res) => {
  const studentID = req.user.studentID;
  try {
    const [rows] = await db.execute(
      `SELECT c.CourseNum, c.CourseName, c.CourseType, c.IsRequired, c.IsEnglishLecture, c.OfferedSemester, c.Credit, uc.Grade
       FROM UserCourse uc
       JOIN Course c ON uc.CourseNum = c.CourseNum
       WHERE uc.StudentID = ?`,
      [studentID]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "과목 정보를 불러오는 중 오류가 발생했습니다." });
  }
};
// controllers/graduationController.js

exports.getGraduationRequirements = async (req, res) => {
  try {
    // 하드코딩된 졸업 요건 목록
    const graduationRequirements = [
      {
        MajorClassification: "22AIAIDS",
        TotalCredits: 130,
        MajorCredits: 72,
        LiberalArtsCredits: 22,
        GeneralEducationCredits: 17,
        CapstoneCourseCount: 2,
        BasicElectiveCredits: 0, // 필요 시 추가
      },
      {
        MajorClassification: "CAI",
        TotalCredits: 130,
        MajorCredits: 60,
        LiberalArtsCredits: 21,
        GeneralEducationCredits: 17,
        CapstoneCourseCount: 2,
        BasicElectiveCredits: 6,
      },
    ];

    // 졸업 요건 로그 추가 (선택 사항)
    console.log("하드코딩된 졸업 요건 목록:", graduationRequirements);

    res.json(graduationRequirements);
  } catch (error) {
    console.error("getGraduationRequirements 에러:", error);
    res
      .status(500)
      .json({ error: "졸업 요건 목록을 불러오는 중 오류가 발생했습니다." });
  }
};
