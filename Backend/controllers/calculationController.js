// controllers/calculationController.js
const db = require("../models/db");

exports.getAdditionalCalculations = async (req, res) => {
  const studentID = req.user.studentID;
  const { option } = req.params;

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

    // 옵션에 따른 MajorClassification 결정
    let majorClassification = userInfo.MajorClassification;

    if (option === "doubleMajor") {
      // 복수전공의 MajorClassification 결정
      // 예: 기존 MajorClassification에 "_DM" 접미사 추가
      majorClassification = `${userInfo.MajorClassification}_DM`;
    } else if (option === "affiliationChange") {
      // 소속 변경 후의 MajorClassification 결정
      // 예: 기존 MajorClassification에 "_AC" 접미사 추가
      majorClassification = `${userInfo.MajorClassification}_AC`;
    } else if (option !== "default") {
      return res.status(400).json({ error: "유효하지 않은 옵션입니다." });
    }

    // 졸업 요건 가져오기
    const [requirementRows] = await db.execute(
      "SELECT * FROM GraduationRequirement WHERE MajorClassification = ?",
      [majorClassification]
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
      if (course.CourseType === "LiberalArts") {
        liberalArtsCredits += credit;
      }

      // 공통교양 학점
      if (course.CourseType === "GeneralEducation") {
        generalEducationCredits += credit;
      }

      // 전공 학점
      if (course.CourseType === "Major") {
        majorCredits += credit;
      }

      // 기본소양 학점
      if (course.CourseType === "BasicElective") {
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

    // 결과 생성
    const result = {
      earnedCredits,
      liberalArts: `${liberalArtsCredits} / ${graduationRequirement.LiberalArtsCredits}`,
      generalEducation: `${generalEducationCredits} / ${graduationRequirement.GeneralEducationCredits}`,
      major: `${majorCredits} / ${graduationRequirement.MajorCredits}`,
      gpa,
      foreignLanguageScore: userInfo.ForeignLanguageScore || 0,
      englishClasses: `${englishLectureCount} / ${
        graduationRequirement.RequiredEnglishLectureCount || 0
      }`,
      capstone: `${capstoneCourseCount} / ${graduationRequirement.CapstoneCourseCount}`,
      basicElective: `${basicElectiveCredits} / ${graduationRequirement.BasicElectiveCredits}`,
    };

    res.json(result);
  } catch (error) {
    console.error("계산 중 오류:", error);
    res.status(500).json({ error: "계산 중 오류가 발생했습니다." });
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
