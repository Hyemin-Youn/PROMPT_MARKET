package com.project.backend.domain.user.repository;

import com.project.backend.domain.user.Entity.PromptUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<PromptUser, Long> {

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);
}
