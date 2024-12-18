# [Dongguk Univ AI Graduate Calculator for U] -> DAGCU
AI융합학부 학생들을 위한 맞춤형 졸업관리 시스템

---
<div><h3>💻 2024-2학기 데이터베이스설계_02 기말 프로젝트</h3></div>

 🧑🏻‍💻 데이터사이언스전공 22학번 서동하 <br>
 👩🏻‍💻 AI융합학부 22학번 이예령 <br>

---
<div><h3>📚 기술 스택</h3></div>
<div> 
 <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
 <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
 <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 
</div>


---
<div><h3>세팅 방법</h3></div>

- local setup
  ```
  npm install react react-dom react-router-dom axios
  npm install express dotenv mysql2 jsonwebtoken bcrypt cors body-parsers
  ```
  
- backend/.env.sample -> .env로 변경
  ```
  DB_HOST=localhost
  DB_USER="yourname"
  DB_PASSWORD="yourpassword"
  DB_NAME="yourdbname"
  JWT_SECRET=1
  PORT=5001 
  ```

- Database/CreateTable.sql -> insert_graduation_courses.sql 쿼리 실행

- Frontend 실행
  ```
  npm start
  ```

- backend 실행
  ```
  node server.js
  ```
