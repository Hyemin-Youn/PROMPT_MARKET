package com.project.backend.domain.prompt.repository;

import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.entity.PromptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PromptRepository extends JpaRepository<Prompt, Long>, JpaSpecificationExecutor<Prompt> {

    List<Prompt> findByStatusOrderByCreatedAtDesc(PromptStatus status);
}
