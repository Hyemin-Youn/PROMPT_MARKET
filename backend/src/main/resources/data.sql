SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE follow;
TRUNCATE TABLE report;
TRUNCATE TABLE comment;
TRUNCATE TABLE purchase;
TRUNCATE TABLE prompt;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 비밀번호: Test1234!
-- user_id: 1=admin, 2=seller1, 3=seller2
INSERT IGNORE INTO users (email, password, nickname, role, status, created_at, updated_at)
VALUES
    ('admin@test.com',   '$2a$10$JO5VrWelYfbZFvvG3WfBD.9sFMsFiSm.1TfjmJGNDUq1ncm88FSMO', '관리자',       'ADMIN', 'ACTIVE', NOW(), NOW()),
    ('seller1@test.com', '$2a$10$JO5VrWelYfbZFvvG3WfBD.9sFMsFiSm.1TfjmJGNDUq1ncm88FSMO', '프롬프트판매자', 'USER',  'ACTIVE', NOW(), NOW()),
    ('seller2@test.com', '$2a$10$JO5VrWelYfbZFvvG3WfBD.9sFMsFiSm.1TfjmJGNDUq1ncm88FSMO', 'AI전문가',      'USER',  'ACTIVE', NOW(), NOW());

INSERT IGNORE INTO prompt (user_id, title, content, preview, thumbnail_url, price, category, ai_type, rating, view_count, status, created_at, updated_at)
VALUES
    (2, 'GPT로 백엔드 코드 리뷰하기', '전체 프롬프트 내용입니다.', 'GPT4를 이용해 백엔드 코드를 자동으로 리뷰합니다.', NULL, 5000, 'BACKEND', 'GPT4', 4.5, 100, 'ACTIVE', NOW(), NOW()),
    (2, 'Claude로 DB 스키마 설계하기', '전체 프롬프트 내용입니다.', 'Claude를 이용해 효율적인 DB 스키마를 설계합니다.', NULL, 3000, 'DB', 'CLAUDE', 4.2, 50, 'ACTIVE', NOW(), NOW()),
    (3, 'Gemini로 React 컴포넌트 생성', '전체 프롬프트 내용입니다.', 'Gemini를 이용해 React 컴포넌트를 자동 생성합니다.', NULL, 2000, 'FRONTEND', 'GEMINI', 3.8, 30, 'ACTIVE', NOW(), NOW()),
    (3, 'AI 프롬프트 최적화 가이드', '전체 프롬프트 내용입니다.', 'AI 모델별 프롬프트 최적화 방법을 안내합니다.', NULL, 8000, 'AI', 'GPT4', 4.9, 200, 'ACTIVE', NOW(), NOW()),
    (2, 'GPT4로 프론트엔드 UI 설계', '전체 프롬프트 내용입니다.', 'GPT4를 활용해 UI 컴포넌트 구조를 설계합니다.', NULL, 4000, 'FRONTEND', 'GPT4', 4.0, 80, 'ACTIVE', NOW(), NOW()),
    (2, 'ChatGPT로 SQL 쿼리 최적화', '전체 프롬프트 내용입니다.', 'ChatGPT를 이용해 복잡한 SQL 쿼리를 최적화합니다.', NULL, 3500, 'DB', 'GPT4', 4.3, 60, 'ACTIVE', NOW(), NOW()),
    (3, 'Claude로 API 문서 자동 생성', '전체 프롬프트 내용입니다.', 'Claude를 활용해 REST API 문서를 자동으로 작성합니다.', NULL, 2500, 'BACKEND', 'CLAUDE', 4.1, 45, 'ACTIVE', NOW(), NOW()),
    (2, 'GPT로 단위 테스트 코드 생성', '전체 프롬프트 내용입니다.', 'GPT4를 이용해 JUnit 단위 테스트를 자동 생성합니다.', NULL, 4500, 'BACKEND', 'GPT4', 4.6, 120, 'ACTIVE', NOW(), NOW()),
    (3, 'Gemini로 CSS 애니메이션 구현', '전체 프롬프트 내용입니다.', 'Gemini를 활용해 CSS 애니메이션을 손쉽게 구현합니다.', NULL, 1500, 'FRONTEND', 'GEMINI', 3.5, 25, 'ACTIVE', NOW(), NOW()),
    (2, 'Claude로 코드 리팩토링하기', '전체 프롬프트 내용입니다.', 'Claude를 이용해 레거시 코드를 효율적으로 리팩토링합니다.', NULL, 6000, 'BACKEND', 'CLAUDE', 4.7, 150, 'ACTIVE', NOW(), NOW()),
    (3, 'GPT로 데이터 분석 보고서 작성', '전체 프롬프트 내용입니다.', 'GPT4를 활용해 데이터 분석 보고서를 자동으로 작성합니다.', NULL, 5500, 'AI', 'GPT4', 4.4, 90, 'ACTIVE', NOW(), NOW()),
    (2, 'Claude로 ERD 설계하기', '전체 프롬프트 내용입니다.', 'Claude를 이용해 데이터베이스 ERD를 설계합니다.', NULL, 3000, 'DB', 'CLAUDE', 4.0, 40, 'ACTIVE', NOW(), NOW()),
    (3, 'Gemini로 TypeScript 타입 정의', '전체 프롬프트 내용입니다.', 'Gemini를 활용해 TypeScript 인터페이스와 타입을 정의합니다.', NULL, 2000, 'FRONTEND', 'GEMINI', 3.9, 35, 'ACTIVE', NOW(), NOW()),
    (2, 'GPT로 Docker 설정 자동화', '전체 프롬프트 내용입니다.', 'GPT4를 이용해 Dockerfile과 docker-compose를 자동 생성합니다.', NULL, 4000, 'BACKEND', 'GPT4', 4.2, 70, 'ACTIVE', NOW(), NOW()),
    (3, 'Claude로 보안 취약점 분석', '전체 프롬프트 내용입니다.', 'Claude를 활용해 코드의 보안 취약점을 분석하고 수정합니다.', NULL, 7000, 'BACKEND', 'CLAUDE', 4.8, 180, 'ACTIVE', NOW(), NOW()),
    (2, 'GPT로 Spring Boot 구조 설계', '전체 프롬프트 내용입니다.', 'GPT4를 이용해 Spring Boot 프로젝트 구조를 설계합니다.', NULL, 5000, 'BACKEND', 'GPT4', 4.5, 110, 'ACTIVE', NOW(), NOW()),
    (3, 'Gemini로 SEO 최적화 전략', '전체 프롬프트 내용입니다.', 'Gemini를 활용해 웹사이트 SEO를 최적화합니다.', NULL, 3000, 'FRONTEND', 'GEMINI', 4.0, 55, 'ACTIVE', NOW(), NOW()),
    (2, 'Claude로 마이크로서비스 설계', '전체 프롬프트 내용입니다.', 'Claude를 이용해 마이크로서비스 아키텍처를 설계합니다.', NULL, 9000, 'BACKEND', 'CLAUDE', 4.9, 220, 'ACTIVE', NOW(), NOW()),
    (3, 'GPT로 인덱스 최적화 전략', '전체 프롬프트 내용입니다.', 'GPT4를 활용해 DB 인덱스 전략을 최적화합니다.', NULL, 4000, 'DB', 'GPT4', 4.3, 65, 'ACTIVE', NOW(), NOW()),
    (2, 'Claude로 CI/CD 파이프라인 구성', '전체 프롬프트 내용입니다.', 'Claude를 이용해 GitHub Actions CI/CD를 구성합니다.', NULL, 5000, 'BACKEND', 'CLAUDE', 4.6, 130, 'ACTIVE', NOW(), NOW()),
    (3, 'GPT로 React 상태 관리 설계', '전체 프롬프트 내용입니다.', 'GPT4를 활용해 Redux/Zustand 상태 관리를 설계합니다.', NULL, 3500, 'FRONTEND', 'GPT4', 4.1, 48, 'ACTIVE', NOW(), NOW()),
    (2, 'Gemini로 AI 챗봇 프롬프트 작성', '전체 프롬프트 내용입니다.', 'Gemini를 이용해 효과적인 AI 챗봇 프롬프트를 작성합니다.', NULL, 6000, 'AI', 'GEMINI', 4.7, 160, 'ACTIVE', NOW(), NOW()),
    (3, 'Claude로 코드 주석 자동 생성', '전체 프롬프트 내용입니다.', 'Claude를 활용해 코드에 주석을 자동으로 추가합니다.', NULL, 2000, 'BACKEND', 'CLAUDE', 3.8, 28, 'ACTIVE', NOW(), NOW()),
    (2, 'GPT로 프로젝트 README 작성', '전체 프롬프트 내용입니다.', 'GPT4를 이용해 전문적인 README 문서를 자동 작성합니다.', NULL, 1500, 'AI', 'GPT4', 4.0, 42, 'ACTIVE', NOW(), NOW()),
    (3, 'Claude로 알고리즘 문제 풀이', '전체 프롬프트 내용입니다.', 'Claude를 활용해 코딩 테스트 알고리즘 문제를 풀이합니다.', NULL, 4500, 'AI', 'CLAUDE', 4.5, 95, 'ACTIVE', NOW(), NOW());

INSERT IGNORE INTO purchase (user_id, prompt_id, paid_price, status, purchased_at)
VALUES
    (2, 3, 2000, 'COMPLETE', NOW()),
    (2, 4, 8000, 'COMPLETE', NOW()),
    (3, 1, 5000, 'COMPLETE', NOW()),
    (3, 2, 3000, 'COMPLETE', NOW());

INSERT IGNORE INTO comment (prompt_id, user_id, content, status, created_at)
VALUES
    (1, 3, '백엔드 코드 리뷰에 정말 유용하게 쓰고 있어요!', 'ACTIVE', NOW()),
    (1, 2, '퀄리티 대비 가격이 합리적인 것 같습니다.', 'ACTIVE', NOW()),
    (2, 3, 'DB 스키마 설계할 때 많은 도움이 됐습니다.', 'ACTIVE', NOW()),
    (3, 2, 'React 컴포넌트 생성이 훨씬 빨라졌어요.', 'ACTIVE', NOW()),
    (4, 2, '프롬프트 최적화 효과가 눈에 띄게 좋아졌습니다.', 'ACTIVE', NOW()),
    (4, 3, 'AI 활용도가 크게 향상됐어요. 추천합니다!', 'ACTIVE', NOW()),
    (5, 3, 'UI 설계 시간이 절반으로 줄었습니다.', 'ACTIVE', NOW()),
    (10, 2, '레거시 코드 정리에 딱 맞는 프롬프트네요.', 'ACTIVE', NOW());

INSERT IGNORE INTO follow (follower_id, following_id, created_at)
VALUES
    (2, 3, NOW()),
    (3, 2, NOW()),
    (1, 2, NOW()),
    (1, 3, NOW());

INSERT IGNORE INTO report (reporter_id, target_type, target_id, reason, detail, status, created_at)
VALUES
    (2, 'PROMPT', 3,  'SPAM',      '스팸성 홍보 내용이 포함되어 있습니다.',   'PENDING',  NOW()),
    (3, 'PROMPT', 11, 'COPYRIGHT', '저작권 침해가 의심되는 내용입니다.',      'PENDING',  NOW()),
    (2, 'COMMENT', 6, 'ABUSE',     '욕설 및 비방이 포함된 댓글입니다.',       'RESOLVED', NOW()),
    (3, 'USER',    2, 'SPAM',      '지속적으로 스팸 프롬프트를 등록합니다.',  'PENDING',  NOW());