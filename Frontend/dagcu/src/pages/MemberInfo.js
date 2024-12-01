import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

import "../styles/MemberInfo.css";

const MemberInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [graduationStats, setGraduationStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        // 사용자 정보 가져오기
        const userResponse = await axios.get("/api/user/me", config);
        setUserInfo(userResponse.data);

        // 졸업 통계 정보 가져오기
        const statsResponse = await axios.get(
          `/api/user/${userResponse.data.StudentID}/graduation-stats`,
          config
        );
        setGraduationStats(statsResponse.data);

        // 이수 과목 목록 가져오기
        const coursesResponse = await axios.get(
          `/api/user/${userResponse.data.StudentID}/courses`,
          config
        );
        setCourses(coursesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleLogoClick = () => {
    navigate("/"); // 메인 경로로 이동
  };
  return (
    <div className="member-info-container">
      <h1 className="logo" onClick={handleLogoClick}>
        DAGCU
      </h1>
      <h2 className="page-title">이수과목</h2>
      <p className="subtitle">
        {userInfo?.Name || "N/A"}({userInfo?.StudentID || "N/A"}) |{" "}
        {userInfo?.Affiliation || "N/A"}
      </p>
      <div className="graduation-stats">
        <p>취득학점: {graduationStats?.earnedCredits ?? "N/A"}학점</p>
        <p>학문교양: {graduationStats?.liberalArtsCredits ?? "N/A"}학점</p>
        <p>공통교양: {graduationStats?.generalEducationCredits ?? "N/A"}학점</p>
        <p>전공: {graduationStats?.majorCredits ?? "N/A"}학점</p>
        <p>
          평균평점:{" "}
          {graduationStats?.gpa !== undefined
            ? graduationStats.gpa.toFixed(2)
            : "N/A"}
        </p>
        <p>영어강의: {graduationStats?.englishLectureCount ?? "N/A"}개</p>
        <p>종합설계: {graduationStats?.capstoneCourseCount ?? "N/A"}개</p>
        <p>기본소양: {graduationStats?.basicElectiveCredits ?? "N/A"}학점</p>
      </div>
      <div className="course-list">
        <table>
          <thead>
            <tr>
              <th>학수번호</th>
              <th>과목명</th>
              <th>이수구분</th>
              <th>필수여부</th>
              <th>영어강의</th>
              <th>개설 학기</th>
              <th>학점</th>
              <th>성적</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.CourseNum || "N/A"}</td>
                  <td>{course.CourseName || "N/A"}</td>
                  <td>{course.CourseType || "N/A"}</td>
                  <td>
                    {course.IsRequired !== undefined
                      ? course.IsRequired
                        ? "O"
                        : "X"
                      : "N/A"}
                  </td>
                  <td>
                    {course.IsEnglishLecture !== undefined
                      ? course.IsEnglishLecture
                        ? "O"
                        : "X"
                      : "N/A"}
                  </td>
                  <td>{course.OfferedSemester || "N/A"}</td>
                  <td>{course.Credit !== undefined ? course.Credit : "N/A"}</td>
                  <td>{course.Grade || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">이수한 과목이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation("/course-list")}>
          과목검색
        </button>
        <button onClick={() => handleNavigation("/member-info")}>
          이수과목
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

export default MemberInfo;
