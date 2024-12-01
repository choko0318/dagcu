# [Dongguk Univ AI Graduate Calculator for U] -> DAGCU

- local setup
  ```
  npm install react 
  npm install react-router-dom 
  ```
  
.env파일의 내용을 수정해야합니다.  <br>
DB_HOST=localhost <br>
DB_USER="yourname" <br>
DB_PASSWORD="yourpassword" <br>
DB_NAME="yourdbname" <br>
JWT_SECRET=1 <br>
PORT=5001 <br>
 <br>
-- ========================================
-- Database Schema for Graduation Management
-- ========================================

-- 1. Create Database
CREATE DATABASE GraduationManagement;
USE GraduationManagement;

-- 2. Course Table: Stores information about all courses
CREATE TABLE Course (
    CourseNum VARCHAR(20) PRIMARY KEY,           -- Course Number: Unique identifier for the course
    CourseName VARCHAR(100) NOT NULL,            -- Course Name
    CourseType VARCHAR(20) NOT NULL,             -- Course Type (e.g., 'Major', 'GeneralEducation', 'LiberalArts')
    IsCapstone BOOLEAN NOT NULL,                 -- Indicates if the course is a Capstone course (TRUE/FALSE)
    IsEnglishLecture BOOLEAN NOT NULL,           -- Indicates if the course is taught in English (TRUE/FALSE)
    Credit INT NOT NULL,                         -- Number of Credits
    OfferedSemester ENUM('1', '2', 'both') NOT NULL  -- Semester when the course is offered ('1', '2', 'both')
);

-- 3. MajorRequiredCourses Table: Maps required courses to each major classification
CREATE TABLE MajorRequiredCourses (
    MajorClassification VARCHAR(50),             -- Major Classification (e.g., '22AIAIC')
    CourseNum VARCHAR(20),                       -- Course Number
    PRIMARY KEY (MajorClassification, CourseNum),
    FOREIGN KEY (CourseNum) REFERENCES Course(CourseNum)
);

-- 4. PrerequisiteCourses Table: Stores prerequisite information for courses
CREATE TABLE PrerequisiteCourses (
    CourseNum VARCHAR(20),                       -- Course Number
    PrerequisiteCourseNum VARCHAR(20),           -- Prerequisite Course Number
    PRIMARY KEY (CourseNum, PrerequisiteCourseNum),
    FOREIGN KEY (CourseNum) REFERENCES Course(CourseNum),
    FOREIGN KEY (PrerequisiteCourseNum) REFERENCES Course(CourseNum)
);

-- 5. UserList Table: Stores user login information
CREATE TABLE UserList (
    StudentID VARCHAR(20) PRIMARY KEY,           -- Student ID
    Name VARCHAR(50) NOT NULL,                   -- Student Name
    Password VARCHAR(255) NOT NULL               -- Encrypted Password
);

-- 6. UserInfo Table: Stores detailed user information
CREATE TABLE UserInfo (
    StudentID VARCHAR(20) PRIMARY KEY,           -- Student ID
    Affiliation VARCHAR(50) NOT NULL,            -- Affiliation (e.g., 'AIC', 'AISW')
    Major VARCHAR(50) NOT NULL,                  -- Major (e.g., 'AI', 'DS', 'CAI')
    ForeignLanguageScore VARCHAR(50),            -- Foreign Language Score
    MajorClassification VARCHAR(50) NOT NULL,    -- Major Classification (e.g., '22AIAIC')
    FOREIGN KEY (StudentID) REFERENCES UserList(StudentID)
);

-- 7. UserCourse Table: Stores courses taken by each user
CREATE TABLE UserCourse (
    StudentID VARCHAR(20),                       -- Student ID
    CourseNum VARCHAR(20),                       -- Course Number
    Grade VARCHAR(2),                            -- Grade received in the course
    YearTaken YEAR NOT NULL,                     -- Year when the course was taken
    SemesterTaken ENUM('1', '2') NOT NULL,       -- Semester when the course was taken ('1', '2')
    PRIMARY KEY (StudentID, CourseNum),
    FOREIGN KEY (StudentID) REFERENCES UserList(StudentID),
    FOREIGN KEY (CourseNum) REFERENCES Course(CourseNum)
);

-- 8. GraduationRequirement Table: Stores graduation requirements for each major classification
CREATE TABLE GraduationRequirement (
    MajorClassification VARCHAR(50) PRIMARY KEY,    -- Major Classification (e.g., '22AIAIC')
    LiberalArtsCredits INT NOT NULL,                -- Required Liberal Arts Credits
    GeneralEducationCredits INT NOT NULL,           -- Required General Education Credits
    MajorCredits INT NOT NULL,                      -- Required Major Credits
    CapstoneCourseCount INT NOT NULL,               -- Required number of Capstone courses
    BasicElectiveCredits INT NOT NULL,              -- Required Basic Elective Credits
    IsScienceCourseRequired BOOLEAN NOT NULL,       -- Indicates if a Science course is required (TRUE/FALSE)
    IsComputerScienceRequired BOOLEAN NOT NULL      -- Indicates if Computer Science recognition is required (TRUE/FALSE)
);

-- ========================================
-- End of Database Schema
-- ========================================
