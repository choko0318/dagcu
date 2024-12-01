import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트 import
import MemberInfo from "./pages/MemberInfo"; // 회원정보 입력
import MainPage from "./pages/MainPage"; // 메인 페이지
import CourseList from "./pages/CourseList"; // 과목 조회
import RecommendedCourses from "./pages/RecommendedCourses"; // 추천 과목 보기
import AdditionalCalculations from "./pages/AdditionalCalculations"; // 특별 계산
import LoginPage from "./pages/LoginPage"; // 특별 계산
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <Router>
      <div>
        <main>
          <Routes>
            {/* 라우팅 설정 */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/member-info" element={<MemberInfo />} />
            <Route path="/course-list" element={<CourseList />} />
            <Route
              path="/recommended-courses"
              element={<RecommendedCourses />}
            />
            <Route
              path="/additional-calculations"
              element={<AdditionalCalculations />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
