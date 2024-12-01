import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig"; // 경로는 실제 파일 위치에 따라 조정

import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignupClick = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedStudentId = studentId.trim();
    const trimmedPassword = password.trim();

    console.log("로그인 시도:", {
      studentID: trimmedStudentId,
      password: trimmedPassword,
    });

    if (!trimmedStudentId || !trimmedPassword) {
      setError("학번과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        studentID: trimmedStudentId,
        password: trimmedPassword,
      });

      console.log("로그인 성공:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error("로그인 오류:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">DAGCU</h1>
        <p className="subtitle">DGU AI Graduate Calculator for U</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="studentId" className="label">
            학번
          </label>
          <input
            type="text"
            id="studentId"
            className="input"
            placeholder="학번을 입력하세요"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <label htmlFor="password" className="label">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="input"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            로그인
          </button>
        </form>
        <button className="signup-button" onClick={handleSignupClick}>
          가입하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
