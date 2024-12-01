// CourseList.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/CourseList.css";

// 모달 접근성 설정
Modal.setAppElement("#root");

const CourseList = () => {
  const [filters, setFilters] = useState({
    courseNum: "",
    courseName: "",
  });
  const [courseList, setCourseList] = useState([]); // 검색 결과 리스트
  const [error, setError] = useState(""); // 에러 메시지 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 열림 상태
  const [selectedCourse, setSelectedCourse] = useState(null); // 선택된 과목
  const [grade, setGrade] = useState(""); // 학점 상태 추가
  const [yearTaken, setYearTaken] = useState(""); // 수강 연도 상태 추가
  const [semesterTaken, setSemesterTaken] = useState("1"); // 수강 학기 상태 추가 (기본값 '1')

  const navigate = useNavigate();

  // 필터 변경 처리
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // 검색 처리
  const handleSearch = async () => {
    setLoading(true); // 로딩 시작
    try {
      const response = await axios.get("/api/courses", {
        params: {
          courseNum: filters.courseNum,
          courseName: filters.courseName,
        },
      });
      setCourseList(response.data);
      setError(""); // 검색 성공 시 에러 메시지 초기화
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("인증 오류: 로그인 후 다시 시도해주세요.");
        // 필요 시 로그인 페이지로 리디렉션
        navigate("/login");
      } else {
        setError("과목 정보를 불러오는 중 오류가 발생했습니다.");
      }
      setCourseList([]); // 에러 발생 시 검색 결과 초기화
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 엔터 키로 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 네비게이션 버튼 핸들러
  const handleNavigation = (path) => {
    navigate(path);
  };

  // 과목 클릭 시 모달 열기
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setGrade(""); // 학점 초기화
    setYearTaken(""); // 수강 연도 초기화
    setSemesterTaken("1"); // 수강 학기 초기화
    setModalIsOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCourse(null);
    setGrade("");
    setYearTaken("");
    setSemesterTaken("1");
  };

  // 수강 과목 추가 처리
  const handleAddCourse = async () => {
    if (!selectedCourse) return;

    // 학점 유효성 검사 (예: A+, B0, C+ 등)
    const gradePattern = /^(A\+|A0|B\+|B0|C\+|C0|D\+|D0|F)$/;
    if (!gradePattern.test(grade)) {
      toast.error("유효한 학점을 입력해주세요 (예: A+, B0, C+)");
      return;
    }

    // 수강 연도 유효성 검사 (예: 2000 ~ 현재 연도)
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(yearTaken, 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear) {
      toast.error(`유효한 수강 연도를 입력해주세요 (2000 ~ ${currentYear})`);
      return;
    }

    // 수강 학기 유효성 검사 ('1' 또는 '2')
    if (!["1", "2"].includes(semesterTaken)) {
      toast.error("유효한 수강 학기를 선택해주세요.");
      return;
    }

    try {
      // 토큰 가져오기
      const token = localStorage.getItem("token");
      if (!token) {
        setError("인증 오류: 로그인 후 다시 시도해주세요.");
        navigate("/login");
        return;
      }

      // 요청 헤더에 토큰 포함
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 수강 과목 추가 요청
      const response = await axios.post(
        "/api/courses/take",
        {
          courseNum: selectedCourse.CourseNum,
          yearTaken: yearNum,
          semesterTaken: semesterTaken,
          grade: grade,
        },
        config // 헤더 포함
      );

      // 성공 메시지 표시
      toast.success(
        `${selectedCourse.CourseName} 과목을 수강 목록에 추가했습니다.`
      );
      closeModal();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("인증 오류: 로그인 후 다시 시도해주세요.");
        navigate("/login");
      } else if (err.response && err.response.status === 400) {
        toast.error(err.response.data.error);
      } else {
        toast.error("수강 과목을 추가하는 중 오류가 발생했습니다.");
      }
      closeModal();
    }
  };

  return (
    <div className="course-list-container">
      <h1 className="logo">DAGCU</h1>
      <p className="subtitle">DGU AI Graduate Calculator for U</p>
      <div className="search-filters">
        <h2 className="page-title">과목검색</h2>

        <div className="filter-group">
          <label htmlFor="courseNum">학수번호</label>
          <input
            type="text"
            id="courseNum"
            name="courseNum"
            value={filters.courseNum}
            onChange={handleFilterChange}
            onKeyPress={handleKeyPress}
            placeholder="학수번호 입력"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="courseName">과목명</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={filters.courseName}
            onChange={handleFilterChange}
            onKeyPress={handleKeyPress}
            placeholder="과목명 입력"
          />
        </div>
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* 에러 메시지 표시 */}
      <div className="course-list">
        <table>
          <thead>
            <tr>
              <th>학수번호</th>
              <th>과목명</th>
              <th>과목 유형</th>
              <th>종설여부</th>
              <th>영강여부</th>
              <th>개설 학기</th>
              <th>학점</th>
              <th>수강여부</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">검색 중입니다...</td>
              </tr>
            ) : courseList.length > 0 ? (
              courseList.map((course) => (
                <tr
                  key={course.CourseNum}
                  onClick={() => handleCourseClick(course)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{course.CourseNum}</td>
                  <td>{course.CourseName}</td>
                  <td>{course.CourseType}</td>
                  <td>{course.IsCapstone ? "O" : "X"}</td>
                  <td>{course.IsEnglishLecture ? "O" : "X"}</td>
                  <td>{course.OfferedSemester}</td>
                  <td>{course.Credit}</td>
                  <td>{course.IsTaken ? "O" : "X"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 모달 설정 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="수강 확인"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>수강 확인</h2>
        <p>
          {selectedCourse
            ? `${selectedCourse.CourseName} 과목을 수강하셨습니까?`
            : "수강하셨습니까?"}
        </p>
        {selectedCourse && (
          <>
            <div className="grade-input">
              <label htmlFor="grade">학점 입력:</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value.toUpperCase())}
                placeholder="예: A+, B0, C+"
              />
            </div>
            <div className="year-semester-input">
              <label htmlFor="yearTaken">수강 연도:</label>
              <input
                type="number"
                id="yearTaken"
                name="yearTaken"
                value={yearTaken}
                onChange={(e) => setYearTaken(e.target.value)}
                placeholder={`예: ${new Date().getFullYear()}`}
                min="2000"
                max={new Date().getFullYear()}
              />
              <label htmlFor="semesterTaken">수강 학기:</label>
              <select
                id="semesterTaken"
                name="semesterTaken"
                value={semesterTaken}
                onChange={(e) => setSemesterTaken(e.target.value)}
              >
                <option value="1">1학기 (봄)</option>
                <option value="2">2학기 (가을)</option>
              </select>
            </div>
          </>
        )}
        <div className="modal-buttons">
          <button onClick={handleAddCourse}>예</button>
          <button onClick={closeModal}>아니요</button>
        </div>
      </Modal>
      <ToastContainer /> {/* Toast 알림 컨테이너 추가 */}
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

export default CourseList;
