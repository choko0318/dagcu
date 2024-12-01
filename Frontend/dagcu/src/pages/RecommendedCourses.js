import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

import "../styles/RecommendedCourses.css";

const RecommendedCourses = () => {
  const [courses, setCourses] = useState([]); // 전체 과목 중 추천 과목
  const [filteredCourses, setFilteredCourses] = useState([]); // 필터링된 과목 리스트
  const [prerequisites, setPrerequisites] = useState([]); // 선이수 과목 데이터
  const [filter, setFilter] = useState(""); // 현재 선택된 필터
  const [error, setError] = useState(""); // 에러 메시지 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
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

        // 추천 과목 가져오기
        const response = await axios.get("/api/recommended-courses", config);
        setCourses(response.data); // 전체 과목 중 추천 과목 설정
        setFilteredCourses(response.data); // 초기에는 전체 추천 과목 표시

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("추천 과목을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [navigate]);

  // 선이수 기반 필터링
  const handlePrerequisiteFilter = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰 없음. 로그인 필요.");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("API 호출 시작: /api/recommended-courses/prerequisites");
      const response = await axios.get(
        "/api/recommended-courses/prerequisites",
        config
      );

      console.log("API 응답:", response.data);
      setFilteredCourses(response.data); // 후수 과목만 필터링
      setFilter("Prerequisite");
    } catch (err) {
      console.error("API 호출 오류:", err);
      if (err.response) {
        console.error("응답 데이터:", err.response.data);
        setError(
          err.response.data.error ||
            "추천 과목을 가져오는 중 오류가 발생했습니다."
        );
      } else {
        setError("네트워크 오류가 발생했습니다.");
      }
    }
  };

  const handleFilter = (type) => {
    setFilter(type);
    if (type === "") {
      setFilteredCourses(courses);
    } else if (type === "Major") {
      setFilteredCourses(
        courses.filter((course) => course.CourseType === "전공")
      );
    } else if (type === "EnglishLecture") {
      setFilteredCourses(courses.filter((course) => course.IsEnglishLecture));
    } else if (type === "1학기" || type === "2학기") {
      setFilteredCourses(
        courses.filter((course) =>
          type === "1학기"
            ? course.OfferedSemester === "1" ||
              course.OfferedSemester === "both"
            : course.OfferedSemester === "2" ||
              course.OfferedSemester === "both"
        )
      );
    } else if (type === "GeneralEducation") {
      setFilteredCourses(
        courses.filter((course) => course.CourseType === "GeneralEducation")
      );
    } else if (type === "LiberalArts") {
      setFilteredCourses(
        courses.filter((course) => course.CourseType === "LiberalArts")
      );
    } else if (type === "BasicElective") {
      setFilteredCourses(
        courses.filter((course) => course.CourseType === "BasicElective")
      );
    }
  };

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
    <div className="recommended-container">
      <h1 className="logo" onClick={handleLogoClick}>
        DAGCU
      </h1>
      <h2 className="page-title">추천과목</h2>
      <div className="filter-buttons">
        <button
          onClick={() => handleFilter("")}
          className={filter === "" ? "active" : ""}
        >
          전체
        </button>
        <button
          onClick={() => handleFilter("Major")}
          className={filter === "Major" ? "active" : ""}
        >
          전공
        </button>
        <button
          onClick={() => handleFilter("EnglishLecture")}
          className={filter === "EnglishLecture" ? "active" : ""}
        >
          영어강의
        </button>
        <button
          onClick={() => handleFilter("1학기")}
          className={filter === "1학기" ? "active" : ""}
        >
          1학기
        </button>
        <button
          onClick={() => handleFilter("2학기")}
          className={filter === "2학기" ? "active" : ""}
        >
          2학기
        </button>
        <button
          onClick={() => handlePrerequisiteFilter()}
          className={filter === "Prerequisite" ? "active" : ""}
        >
          선이수 추천
        </button>
      </div>
      <div className="course-list">
        <table>
          <thead>
            <tr>
              <th>학수번호</th>
              <th>과목명</th>
              <th>과목 유형</th>
              <th>필수여부</th>
              <th>영어강의</th>
              <th>개설 학기</th>
              <th>학점</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <tr key={index}>
                  <td>{course.CourseNum}</td>
                  <td>{course.CourseName}</td>
                  <td>{course.CourseType}</td>
                  <td>{course.IsRequired ? "O" : "X"}</td>
                  <td>{course.IsEnglishLecture ? "O" : "X"}</td>
                  <td>{course.OfferedSemester}</td>
                  <td>{course.Credit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">추천 과목이 없습니다.</td>
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

export default RecommendedCourses;
