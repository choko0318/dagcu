# Insert Graduation Requirements
INSERT INTO GraduationRequirement (
    MajorClassification, LiberalArtsCredits, GeneralEducationCredits, MajorCredits,
    CapstoneCourseCount, BasicElectiveCredits, IsScienceCourseRequired, IsComputerScienceRequired
)
VALUES
('22AIAIDS', 22, 17, 72, 2, 0, TRUE, TRUE),  -- 복수전공
('22AISWDS', 18, 17, 60, 1, 0, FALSE, TRUE),  -- DS 전공
('22AICDS', 18, 17, 60, 1, 0, FALSE, TRUE),  -- DS 전공
('23AISWDS', 18, 17, 60, 1, 0, FALSE, TRUE),  -- DS 전공
('24AISWDS', 18, 25, 60, 1, 0, FALSE, TRUE),  -- DS 전공
('22AICAI', 22, 17, 60, 2, 0, FALSE, TRUE),  -- AI 전공
('22AISWAI', 22, 17, 60, 2, 0, FALSE, TRUE),  -- AI 전공
('23AISWAI', 22, 17, 60, 2, 0, TRUE, TRUE),  -- AI 전공
('24AISWAI', 22, 25, 60, 2, 0, TRUE, TRUE),  -- AI 전공
('CAI', 21, 17, 60, 2, 6, FALSE, TRUE);   -- 컴퓨터 AI

# Insert Courses
INSERT INTO Course (CourseNum, CourseName, CourseType, IsCapstone, IsEnglishLecture, Credit, OfferedSemester)
VALUES
('AID2002', '통계이론2', '전공', 0, 0, 3, '2'),
('AID2003', '데이터마이닝', '전공', 0, 0, 3, '2'),
('AID2004', '회귀분석', '전공', 0, 0, 3, '2'),
('ASW2007', '프로그래밍기초', '전공', 0, 0, 3, 'both'),
('CSC2007', '자료구조', '전공', 0, 0, 3, '1'),
('CSC4004', '공개SW프로젝트', '전공', 0, 0, 3, '1'),
('CSC4008', '다변량및시계열데이터분석', '전공', 0, 0, 3, '1'),
('CSC4019', '데이터베이스', '전공', 0, 0, 3, '1'),
('CSC4020', '데이터베이스설계', '전공', 0, 1, 3, '2'),
('CSC4022', '머신러닝', '전공', 0, 0, 3, '1'),
('PRI4001', '미적분학및연습1', '학문기초', 0, 0, 3, 'both'),
('CSC4018', '종합설계1', '전공', 1, 1, 3, 'both'),
('PRI4024', '공학선형대수학', '학문기초', 0, 0, 3, 'both'),
('PRI4023', '확률및통계학', '학문기초', 0, 0, 3, 'both'),
('CSC2004', '어드벤처디자인', '전공', 0, 0, 3, 'both'),
('CSC4012', '인공지능', '전공', 0, 0, 3, '2'),
('CSC4023', '딥러닝입문', '전공', 0, 0, 3, '2'),
('AID2001', '통계이론1', '전공', 0, 0, 3, '1'),
('CSC4019', '종합설계2', '전공', 1, 1, 3, 'both'),
('CSC2008', '알고리즘', '전공', 0, 0, 3, 'both');

# Insert Prerequisite Courses
INSERT INTO PrerequisiteCourses (CourseNum, PrerequisiteCourseNum)
VALUES
('AID2002', 'AID2001'), -- 통계이론1 -> 통계이론2
('CSC4020', 'CSC4019'), -- 데이터베이스 -> 데이터베이스설계
('CSC4022', 'CSC4012'), -- 인공지능 -> 머신러닝
('CSC4023', 'CSC4022'), -- 머신러닝 -> 딥러닝입문
('CSC2007', 'ASW2007'), -- 프로그래밍기초 -> 자료구조
('CSC2008', 'ASW2007'), -- 프로그래밍기초 -> 알고리즘
('CSC4004', 'CSC2004'), -- 어드벤처디자인 -> 공개SW프로젝트
('CSC4018', 'CSC4004'); -- 공개SW프로젝트 -> 종합설계1
