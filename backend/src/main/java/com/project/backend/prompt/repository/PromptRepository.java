package com.project.backend.prompt.repository;

import com.project.backend.prompt.entity.Prompt;
import com.project.backend.prompt.enums.PromptStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromptRepository extends JpaRepository<Prompt, Long> {

    // 활성화된 게시글 목록 조회
    List<Prompt> findByStatusOrderByCreatedAtDesc(PromptStatus status);
}
