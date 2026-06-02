SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE purchase;
TRUNCATE TABLE prompt;
TRUNCATE TABLE `user`;
SET FOREIGN_KEY_CHECKS = 1;

INSERT IGNORE INTO `user` (email, password, nickname, role, status, created_at, updated_at)
VALUES
    ('seller1@test.com', 'password123', '프롬프트판매자', 'USER', 'ACTIVE', NOW(), NOW()),
    ('seller2@test.com', 'password123', 'AI전문가', 'USER', 'ACTIVE', NOW(), NOW());

INSERT IGNORE INTO prompt (user_id, title, content, preview, thumbnail_url, price, category, ai_type, rating, view_count, status, created_at, updated_at)
VALUES
    (1, 'GPT로 백엔드 코드 리뷰하기', '전체 프롬프트 내용입니다.', 'GPT4를 이용해 백엔드 코드를 자동으로 리뷰합니다.', NULL, 5000, 'BACKEND', 'GPT4', 4.5, 100, 'ACTIVE', NOW(), NOW()),
    (1, 'Claude로 DB 스키마 설계하기', '전체 프롬프트 내용입니다.', 'Claude를 이용해 효율적인 DB 스키마를 설계합니다.', NULL, 3000, 'DB', 'CLAUDE', 4.2, 50, 'ACTIVE', NOW(), NOW()),
    (2, 'Gemini로 React 컴포넌트 생성', '전체 프롬프트 내용입니다.', 'Gemini를 이용해 React 컴포넌트를 자동 생성합니다.', NULL, 2000, 'FRONTEND', 'GEMINI', 3.8, 30, 'ACTIVE', NOW(), NOW()),
    (2, 'AI 프롬프트 최적화 가이드', '전체 프롬프트 내용입니다.', 'AI 모델별 프롬프트 최적화 방법을 안내합니다.', NULL, 8000, 'AI', 'GPT4', 4.9, 200, 'ACTIVE', NOW(), NOW()),
    (1, 'GPT4로 프론트엔드 UI 설계', '전체 프롬프트 내용입니다.', 'GPT4를 활용해 UI 컴포넌트 구조를 설계합니다.', NULL, 4000, 'FRONTEND', 'GPT4', 4.0, 80, 'ACTIVE', NOW(), NOW());

INSERT IGNORE INTO purchase (user_id, prompt_id, paid_price, status, purchased_at)
VALUES
    (1, 1, 5000, 'COMPLETE', NOW()),
    (1, 2, 3000, 'COMPLETE', NOW()),
    (2, 3, 2000, 'CANCEL',   NOW()),
    (2, 4, 8000, 'COMPLETE', NOW()),
    (1, 4, 8000, 'PENDING',  NOW());
