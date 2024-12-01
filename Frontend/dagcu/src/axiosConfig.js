// axiosConfig.js
import axios from "axios";

// 백엔드 서버의 URL을 baseURL로 설정 (실제 서버 주소로 변경)
const instance = axios.create({
  baseURL: "http://localhost:5001", // 실제 백엔드 서버의 주소
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰 가져오기
    const token = localStorage.getItem("token");
    if (token) {
      // 토큰을 Authorization 헤더에 추가
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
