# [Dongguk Univ AI Graduate Calculator for U] -> DAGCU

2024-2학기 데이터베이스설계_02 기말 프로젝트

 데이터사이언스전공 22학번 서동하 <br>
 AI융합학부 22학번 이예령 <br>

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
