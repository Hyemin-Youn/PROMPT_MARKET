package com.project.backend.domain.like.repository;

import com.project.backend.domain.like.entity.PromptLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromptLikeRepository extends JpaRepository<PromptLike, Long> {

    Optional<PromptLike> findByUserIdAndPromptId(Long userId, Long promptId);
    boolean existsByUserIdAndPromptId(Long userId, Long promptId);
}
