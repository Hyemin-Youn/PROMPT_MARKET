DROP DATABASE IF EXISTS prompt_market;
CREATE DATABASE IF NOT EXISTS prompt_market
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE prompt_market;

-- =============================================
-- 1. user (회원)
-- =============================================
CREATE TABLE users (
    user_id    BIGINT          NOT NULL AUTO_INCREMENT,
    email      VARCHAR(100)    NOT NULL,
    password   VARCHAR(255)    NOT NULL,
    nickname   VARCHAR(50)     NOT NULL,
    role       ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    status     ENUM('ACTIVE','SUSPENDED','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_user_email    (email),
    UNIQUE KEY uq_user_nickname (nickname),
    INDEX idx_user_status       (status)
);

-- =============================================
-- 2. prompt (프롬프트 게시판)
-- =============================================
CREATE TABLE prompt (
    prompt_id     BIGINT          NOT NULL AUTO_INCREMENT,
    user_id       BIGINT          NOT NULL,
    title         VARCHAR(255)    NOT NULL,
    content       TEXT            NOT NULL,
    preview       TEXT            NOT NULL,
    thumbnail_url VARCHAR(500)    NULL,                        
    price         INT             NOT NULL DEFAULT 0,
    category      ENUM('FRONTEND','BACKEND','AI','DB','ETC') NOT NULL,
    ai_type       ENUM('GPT4','CLAUDE','GEMINI','ETC')       NOT NULL,
    rating        FLOAT           NOT NULL DEFAULT 0,
    view_count    INT             NOT NULL DEFAULT 0,
    status        ENUM('ACTIVE','HIDDEN','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (prompt_id),
    FOREIGN KEY fk_prompt_user (user_id) REFERENCES users (user_id) ON DELETE RESTRICT,
    INDEX idx_prompt_category   (category),
    INDEX idx_prompt_ai_type    (ai_type),
    INDEX idx_prompt_status     (status),
    INDEX idx_prompt_price      (price),
    INDEX idx_prompt_rating     (rating)
);

-- =============================================
-- 3. purchase (구매 내역)
-- =============================================
CREATE TABLE purchase (
    purchase_id  BIGINT    NOT NULL AUTO_INCREMENT,
    user_id      BIGINT    NOT NULL,
    prompt_id    BIGINT    NOT NULL,
    paid_price   INT       NOT NULL,
    status       ENUM('PENDING','COMPLETE','CANCEL') NOT NULL DEFAULT 'PENDING',
    purchased_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (purchase_id),
    FOREIGN KEY fk_purchase_user   (user_id)   REFERENCES users  (user_id)   ON DELETE RESTRICT,
    FOREIGN KEY fk_purchase_prompt (prompt_id) REFERENCES prompt (prompt_id) ON DELETE RESTRICT,
    UNIQUE KEY uq_purchase (user_id, prompt_id),
    INDEX idx_purchase_purchased_at (purchased_at),
    INDEX idx_purchase_status       (status)
);

-- =============================================
-- 4. rating (별점)
-- =============================================
CREATE TABLE rating (
    rating_id  BIGINT    NOT NULL AUTO_INCREMENT,
    user_id    BIGINT    NOT NULL,
    prompt_id  BIGINT    NOT NULL,
    score      INT       NOT NULL,
    created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (rating_id),
    FOREIGN KEY fk_rating_user   (user_id)   REFERENCES users  (user_id)   ON DELETE RESTRICT,
    FOREIGN KEY fk_rating_prompt (prompt_id) REFERENCES prompt (prompt_id) ON DELETE CASCADE,
    UNIQUE KEY uq_rating (user_id, prompt_id),
    CONSTRAINT chk_rating_score CHECK (score BETWEEN 1 AND 5)
);

-- =============================================
-- 5. comment (댓글)
-- =============================================
CREATE TABLE comment (
    comment_id BIGINT          NOT NULL AUTO_INCREMENT,
    prompt_id  BIGINT          NOT NULL,
    user_id    BIGINT          NOT NULL,
    content    VARCHAR(1000)   NOT NULL,
    status     ENUM('ACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (comment_id),
    FOREIGN KEY fk_comment_prompt (prompt_id) REFERENCES prompt (prompt_id) ON DELETE CASCADE,
    FOREIGN KEY fk_comment_user   (user_id)   REFERENCES users  (user_id)   ON DELETE RESTRICT,
    INDEX idx_comment_status (status)
);

-- =============================================
-- 6. likes (좋아요)
-- =============================================
CREATE TABLE likes (
    likes_id   BIGINT    NOT NULL AUTO_INCREMENT,
    user_id    BIGINT    NOT NULL,
    prompt_id  BIGINT    NOT NULL,
    created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (likes_id),
    FOREIGN KEY fk_likes_user   (user_id)   REFERENCES users  (user_id)   ON DELETE CASCADE,
    FOREIGN KEY fk_likes_prompt (prompt_id) REFERENCES prompt (prompt_id) ON DELETE CASCADE,
    UNIQUE KEY uq_likes (user_id, prompt_id)
);

-- =============================================
-- 7. report (신고)
-- =============================================
CREATE TABLE report (
    report_id   BIGINT       NOT NULL AUTO_INCREMENT, -- 신고 고유
    reporter_id BIGINT       NOT NULL, -- 신고한 유저 ID (users 테이블)
    target_type ENUM('PROMPT','COMMENT','USER') NOT NULL, -- 신고 대상 종
    target_id   BIGINT       NOT NULL, -- 신고 대상의 ID
    reason      ENUM('SPAM','ABUSE','COPYRIGHT','ETC') NOT NULL, -- 신고 사유
    detail      VARCHAR(500) NULL, -- 상세 사유 (선택)
    status      ENUM('PENDING','RESOLVED','REJECTED') NOT NULL DEFAULT 'PENDING', -- 처리 상태
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (report_id),
    FOREIGN KEY fk_report_reporter (reporter_id) REFERENCES users (user_id) ON DELETE CASCADE,
    UNIQUE KEY uq_report (reporter_id, target_type, target_id), -- 중복 신고 방지
    INDEX idx_report_status (status)
);

-- =============================================
-- 8. follow (팔로우)
-- =============================================
CREATE TABLE follow (
    follow_id    BIGINT    NOT NULL AUTO_INCREMENT,
    follower_id  BIGINT    NOT NULL,
    following_id BIGINT    NOT NULL,
    created_at   DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (follow_id),
    FOREIGN KEY fk_follow_follower  (follower_id)  REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY fk_follow_following (following_id) REFERENCES users (user_id) ON DELETE CASCADE,
    UNIQUE KEY uq_follow (follower_id, following_id)
);
