import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 네비게이션을 위해 추가
import axios from "../axiosConfig"; // 경로는 실제 파일 위치에 따라 조정
import "../styles/SignUpPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    password: "",
    confirmPassword: "",
    affiliation: "",
    major: "",
  });

  const [error, setError] = useState(""); // 에러 메시지 상태 추가

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelect = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 이전 에러 메시지 초기화

    // 입력 값 검증
    if (
      !formData.studentId ||
      !formData.name ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.affiliation ||
      !formData.major
    ) {
      setError("모든 필수 입력 필드를 채워주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await axios.post("/api/signup", {
        studentID: formData.studentId,
        name: formData.name,
        password: formData.password,
        affiliation: formData.affiliation,
        major: formData.major,
      });

      // 성공 메시지 표시
      alert("회원가입이 완료되었습니다!");

      // 로그인 페이지로 이동 또는 메인 페이지로 이동
      navigate("/login"); // 로그인 페이지로 이동
    } catch (err) {
      // 에러 처리
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="logo">DAGCU</h1>
        <p className="subtitle">DGU AI Graduate Calculator for U</p>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="studentId" className="label">
                학번
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="input"
                placeholder="학번을 입력하세요"
              />
            </div>
            <div className="input-group">
              <label htmlFor="name" className="label">
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="이름을 입력하세요"
              />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="password" className="label">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword" className="label">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">소속</label>
            <div className="button-group">
              {["AIC", "AISW"].map((affiliation) => (
                <button
                  type="button"
                  key={affiliation}
                  className={`option-button ${
                    formData.affiliation === affiliation ? "selected" : ""
                  }`}
                  onClick={() => handleSelect("affiliation", affiliation)}
                >
                  {affiliation}
                </button>
              ))}
            </div>
          </div>
          <div className="input-group">
            <label className="label">전공 (희망)</label>
            <div className="button-group">
              {["AI", "DS", "CAI"].map((major) => (
                <button
                  type="button"
                  key={major}
                  className={`option-button ${
                    formData.major === major ? "selected" : ""
                  }`}
                  onClick={() => handleSelect("major", major)}
                >
                  {major}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* 에러 메시지 표시 */}
          <button type="submit" className="submit-button">
            가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
