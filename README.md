# [Dongguk Univ AI Graduate Calculator for U] -> DAGCU
AI융합학부 학생들을 위한 맞춤형 졸업관리 시스템

---
2024-2학기 데이터베이스설계_02 기말 프로젝트

 데이터사이언스전공 22학번 서동하 <br>
 AI융합학부 22학번 이예령 <br>

---
<div align=center><h3>📚 기술 스택</h3></div>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 
<img src="https://img.shields.io/badge/mariaDB-003545?style=for-the-badge&logo=mariaDB&logoColor=white"> 
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 


---

- local setup
  ```
  npm install react 
  npm install react-router-dom 
  ```
  
- backend/.env.sample의 내용 수정 -> 이후 파일명 env로 변경
  ```
  DB_HOST=localhost
  DB_USER="yourname"
  DB_PASSWORD="yourpassword"
  DB_NAME="yourdbname"
  JWT_SECRET=1
  PORT=5001 
  ```

- Database/CreateTable.sql 쿼리 실행

- Frontend 실행
  ```
  npm start
  ```

- backend 실행
  ```
  node server.js
  ```
