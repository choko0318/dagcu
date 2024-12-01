// AdditionalCalculations.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

import "../styles/AdditionalCalculations.css";

const AdditionalCalculations = () => {
  const [currentOption, setCurrentOption] = useState("default");
  const [graduationInfo, setGraduationInfo] = useState(null);
  const [graduationRequirements, setGraduationRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // 졸업 요건 목록을 가져오는 함수
  const fetchGraduationRequirements = () => {
    try {
      // 하드코딩된 졸업 요건 목록 설정
      const hardcodedGraduationRequirements = [
        {
          MajorClassification: "22AIAIDS",
          TotalCredits: 130,
          MajorCredits: 72,
          LiberalArtsCredits: 22,
          GeneralEducationCredits: 17,
          CapstoneCourseCount: 2,
          BasicElectiveCredits: 0, // 필요 시 추가
          EnglishLectureRequirement: 4,
          CapstoneCourseRequirement: 2,
        },
        {
          MajorClassification: "CAI",
          TotalCredits: 130,
          MajorCredits: 60,
          LiberalArtsCredits: 21,
          GeneralEducationCredits: 17,
          CapstoneCourseCount: 2,
          BasicElectiveCredits: 6,
          EnglishLectureRequirement: 4,
          CapstoneCourseRequirement: 2,
        },
        // 필요한 다른 전공 요건 추가 가능
      ];

      // 졸업 요건 상태 설정
      setGraduationRequirements(hardcodedGraduationRequirements);

      if (hardcodedGraduationRequirements.length > 0) {
        // 기본으로 '22AIAIDS' 졸업 요건을 선택
        const defaultMajor = "22AIAIDS";
        setCurrentOption(defaultMajor);
        fetchGraduationInfo(defaultMajor);
      } else {
        setError("선택된 졸업 요건이 존재하지 않습니다.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("졸업 요건 목록을 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  // 선택된 MajorClassification에 따른 졸업 요건 이수 현황을 가져오는 함수
  const fetchGraduationInfo = async (majorClassification) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log(
        `API 호출: /api/graduation/details?majorClassification=${majorClassification}`
      );

      const response = await axios.get(
        `/api/graduation/details?majorClassification=${majorClassification}`,
        config
      );

      // API 응답 로그 추가
      console.log(`응답 데이터 for ${majorClassification}:`, response.data);

      setGraduationInfo(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // 졸업 요건 목록을 먼저 설정하고, 기본 졸업 요건을 선택
    fetchGraduationRequirements();
    // 사용자 과목 데이터를 가져오는 함수는 별도로 호출됩니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionChange = (majorClassification) => {
    console.log(`졸업 요건 선택 변경: ${majorClassification}`);
    setCurrentOption(majorClassification);
    setLoading(true);
    fetchGraduationInfo(majorClassification);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!graduationInfo || !graduationInfo.graduationRequirement) {
    return <div>데이터가 없습니다.</div>;
  }

  // 필요한 영어 강의 수를 항상 4로 설정
  const englishClassesRequired = 4;

  // 안전하게 데이터 접근
  const progress = graduationInfo.progress;
  const requirement = graduationRequirements.find(
    (req) => req.MajorClassification === currentOption
  );

  const totalCreditsEarned = parseInt(progress.totalCreditsEarned) || 0;
  const totalCreditsRequired = parseInt(requirement.TotalCredits) || 130;

  const majorCreditsEarned = parseInt(progress.majorCreditsEarned) || 0;
  const majorCreditsRequired = parseInt(requirement.MajorCredits) || 0;

  const liberalArtsCreditsEarned =
    parseInt(progress.liberalArtsCreditsEarned) || 0;
  const liberalArtsCreditsRequired =
    parseInt(requirement.LiberalArtsCredits) || 0;

  const generalEducationCreditsEarned =
    parseInt(progress.generalEducationCreditsEarned) || 0;
  const generalEducationCreditsRequired =
    parseInt(requirement.GeneralEducationCredits) || 0;

  // GPA 계산 (백엔드에서 제공한다고 가정)
  const gpa = progress.gpa;
  const formattedGPA = typeof gpa === "number" ? gpa.toFixed(2) : "N/A";

  // 기타 졸업 요건
  const foreignLanguageScore = parseInt(progress.foreignLanguageScore) || 0;
  const englishLectureCount = parseInt(progress.englishLectureCount) || 0;
  const capstoneCourseCount = parseInt(progress.capstoneCourseCount) || 0;

  const englishLectureRequirement =
    parseInt(requirement.EnglishLectureRequirement) || 4;
  const capstoneCourseRequirement =
    parseInt(requirement.CapstoneCourseRequirement) || 1;

  // 선택된 졸업 요건과 사용자의 이수 현황을 비교하는 함수
  const compareRequirements = () => {
    const comparisons = {
      totalCredits: {
        earned: totalCreditsEarned,
        required: totalCreditsRequired,
        status: totalCreditsEarned >= totalCreditsRequired ? "충족" : "미충족",
      },
      majorCredits: {
        earned: majorCreditsEarned,
        required: majorCreditsRequired,
        status: majorCreditsEarned >= majorCreditsRequired ? "충족" : "미충족",
      },
      liberalArtsCredits: {
        earned: liberalArtsCreditsEarned,
        required: liberalArtsCreditsRequired,
        status:
          liberalArtsCreditsEarned >= liberalArtsCreditsRequired
            ? "충족"
            : "미충족",
      },
      generalEducationCredits: {
        earned: generalEducationCreditsEarned,
        required: generalEducationCreditsRequired,
        status:
          generalEducationCreditsEarned >= generalEducationCreditsRequired
            ? "충족"
            : "미충족",
      },
      gpa: {
        earned: gpa !== "N/A" ? gpa : 0,
        required: 2.0,
        status: gpa >= 2.0 ? "충족" : "미충족",
      },
      foreignLanguageScore: {
        earned: foreignLanguageScore,
        required: 700,
        status: foreignLanguageScore >= 700 ? "충족" : "미충족",
      },
      englishLecture: {
        earned: englishLectureCount,
        required: englishClassesRequired,
        status:
          englishLectureCount >= englishClassesRequired ? "충족" : "미충족",
      },
      capstoneCourse: {
        earned: capstoneCourseCount,
        required: capstoneCourseRequirement,
        status:
          capstoneCourseCount >= capstoneCourseRequirement ? "충족" : "미충족",
      },
      basicElective: {
        earned: parseInt(progress.basicElective) || 0,
        required: parseInt(requirement.BasicElectiveCredits) || 0,
        status:
          (parseInt(progress.basicElective) || 0) >=
          (parseInt(requirement.BasicElectiveCredits) || 0)
            ? "충족"
            : "미충족",
      },
    };

    // 비교 결과 로그 추가
    console.log("비교 결과:", comparisons);

    return comparisons;
  };

  const comparisons = compareRequirements();

  return (
    <div className="additional-calculations-container">
      <h1 className="logo">DAGCU</h1>
      <h2 className="page-title">기타계산</h2>
      <p className="subtitle">
        전공 분류: {requirement.MajorClassification || "N/A"}
      </p>
      <div className="option-buttons">
        {graduationRequirements.map((req) => (
          <button
            key={req.MajorClassification}
            className={
              currentOption === req.MajorClassification ? "active" : ""
            }
            onClick={() => handleOptionChange(req.MajorClassification)}
          >
            {req.MajorClassification} 요건
          </button>
        ))}
      </div>
      <div className="graduation-info-box">
        <p>
          취득학점 | {comparisons.totalCredits.earned}학점 /{" "}
          {comparisons.totalCredits.required}학점 필요 -{" "}
          <span
            className={
              comparisons.totalCredits.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.totalCredits.status}
          </span>
        </p>
        <p>
          전공 | {comparisons.majorCredits.earned}학점 /{" "}
          {comparisons.majorCredits.required}학점 필요 -{" "}
          <span
            className={
              comparisons.majorCredits.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.majorCredits.status}
          </span>
        </p>
        <p>
          학문교양 | {comparisons.liberalArtsCredits.earned}학점 /{" "}
          {comparisons.liberalArtsCredits.required}학점 필요 -{" "}
          <span
            className={
              comparisons.liberalArtsCredits.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.liberalArtsCredits.status}
          </span>
        </p>
        <p>
          공통교양 | {comparisons.generalEducationCredits.earned}학점 /{" "}
          {comparisons.generalEducationCredits.required}학점 필요 -{" "}
          <span
            className={
              comparisons.generalEducationCredits.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.generalEducationCredits.status}
          </span>
        </p>
        <p>
          평균 평점 | {formattedGPA} (2.0 이상) -{" "}
          <span
            className={
              comparisons.gpa.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.gpa.status}
          </span>
        </p>
        <p>
          외국어 성적 | {foreignLanguageScore}점 (TOEIC 700 이상) -{" "}
          <span
            className={
              comparisons.foreignLanguageScore.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.foreignLanguageScore.status}
          </span>
        </p>
        <p>
          영어 강의 | {englishLectureCount}개 / {englishClassesRequired}개 필요
          -{" "}
          <span
            className={
              comparisons.englishLecture.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.englishLecture.status}
          </span>
        </p>
        <p>
          종합설계 | {capstoneCourseCount}개 / {capstoneCourseRequirement}개
          필요 -{" "}
          <span
            className={
              comparisons.capstoneCourse.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.capstoneCourse.status}
          </span>
        </p>
        <p>
          기본소양 | {progress.basicElective || "0 / 0"}학점 /{" "}
          {comparisons.basicElective.required}학점 필요 -{" "}
          <span
            className={
              comparisons.basicElective.status === "충족"
                ? "status-fulfilled"
                : "status-not-fulfilled"
            }
          >
            {comparisons.basicElective.status}
          </span>
        </p>
      </div>
      <div className="navigation-buttons">
        <button onClick={() => navigate("/course-list")}>과목검색</button>
        <button onClick={() => navigate("/member-info")}>상세보기</button>
        <button onClick={() => navigate("/recommended-courses")}>
          추천과목
        </button>
        <button onClick={() => navigate("/additional-calculations")}>
          기타계산
        </button>
      </div>
    </div>
  );
};

export default AdditionalCalculations;
