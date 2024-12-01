// MainPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axiosConfig"; // 경로는 실제 파일 위치에 따라 조정

import "../styles/MainPage.css";

const MainPage = () => {
  const [userInfo, setUserInfo] = useState(null); // 초기값을 null로 설정
  const [graduationInfo, setGraduationInfo] = useState(null); // 초기값을 null로 설정
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  const navigate = useNavigate();
  const location = useLocation(); // 경로 변경 감지를 위한 훅 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 로딩 시작
        setLoading(true);

        // 토큰 가져오기 (로그인 시 저장한 토큰)
        const token = localStorage.getItem("token");

        // 토큰이 없으면 로그인 페이지로 이동
        if (!token) {
          navigate("/login");
          return;
        }

        // 헤더에 토큰 포함
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // 사용자 정보 가져오기
        const userResponse = await axios.get("/api/user/me", config);
        setUserInfo(userResponse.data);

        // 졸업 요건 정보 가져오기
        const graduationResponse = await axios.get(
          "/api/graduation/details",
          config
        );
        setGraduationInfo(graduationResponse.data);

        // 로딩 완료
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [location]); // 경로 변경 시마다 데이터를 다시 가져오도록 설정

  const handleNavigation = (path) => {
    navigate(path); // 경로로 이동
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // 안전하게 데이터 접근
  const totalCreditsEarned = graduationInfo?.progress?.totalCreditsEarned ?? 0;
  const totalCreditsRequired =
    graduationInfo?.graduationRequirement?.TotalCredits ?? 130;

  const majorCreditsEarned = graduationInfo?.progress?.majorCreditsEarned ?? 0;
  const majorCreditsRequired =
    graduationInfo?.graduationRequirement?.MajorCredits ?? 0;

  const liberalArtsCreditsEarned =
    graduationInfo?.progress?.liberalArtsCreditsEarned ?? 0;
  const liberalArtsCreditsRequired =
    graduationInfo?.graduationRequirement?.LiberalArtsCredits ?? 0;

  const generalEducationCreditsEarned =
    graduationInfo?.progress?.generalEducationCreditsEarned ?? 0;
  const generalEducationCreditsRequired =
    graduationInfo?.graduationRequirement?.GeneralEducationCredits ?? 0;

  // GPA 계산 (백엔드에서 제공한다고 가정)
  const gpa = graduationInfo?.progress?.gpa;
  const formattedGPA = typeof gpa === "number" ? gpa.toFixed(2) : "N/A";

  // 기타 졸업 요건
  const foreignLanguageScore =
    graduationInfo?.progress?.foreignLanguageScore ?? "N/A";
  const englishLectureCount =
    graduationInfo?.progress?.englishLectureCount ?? 0;
  const capstoneCourseCount =
    graduationInfo?.progress?.capstoneCourseCount ?? 0;

  const englishLectureRequirement =
    graduationInfo?.graduationRequirement?.EnglishLectureRequirement ?? 4;
  const capstoneCourseRequirement =
    graduationInfo?.graduationRequirement?.CapstoneCourseRequirement ?? "N/A";

  return (
    <div className="main-container">
      <h1 className="logo">DAGCU</h1>
      <p className="subtitle">DGU AI Graduate Calculator for U</p>

      <p className="subtitle2">
        <span className="subname">{userInfo?.Name}</span>({userInfo?.StudentID}
        )님이 졸업하려면.
      </p>
      <div className="graduation-info-box">
        <p>
          취득학점 | <span className="subname">{totalCreditsEarned}학점</span>{" "}
          (총 {totalCreditsRequired}학점 필요)
        </p>
        <p>
          전공 | <span className="subname">{majorCreditsEarned}학점</span> (
          {majorCreditsRequired}학점 필요)
        </p>
        <p>
          학문교양 |{" "}
          <span className="subname">{liberalArtsCreditsEarned}학점</span> (
          {liberalArtsCreditsRequired}학점 필요)
        </p>
        <p>
          공통교양 |{" "}
          <span className="subname">{generalEducationCreditsEarned}학점</span> (
          {generalEducationCreditsRequired}학점 필요)
        </p>
        <p>평균 평점 | {formattedGPA} (2.0 이상)</p>
        <p>외국어 성적 | {foreignLanguageScore}점 (TOEIC 700 이상)</p>
        <p>
          영어 강의 | {englishLectureCount}개 ({englishLectureRequirement}개
          필요)
        </p>
        <p>
          종합설계 | {capstoneCourseCount}개 ({capstoneCourseRequirement}개
          필요)
        </p>
        {/* 필요한 다른 졸업 요건도 추가 가능 */}
      </div>
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation("/course-list")}>
          과목검색
        </button>
        <button onClick={() => handleNavigation("/member-info")}>
          상세보기
        </button>
        <button onClick={() => handleNavigation("/recommended-courses")}>
          추천과목
        </button>
        <button onClick={() => handleNavigation("/additional-calculations")}>
          기타계산
        </button>
      </div>
    </div>
  );
};

export default MainPage;
