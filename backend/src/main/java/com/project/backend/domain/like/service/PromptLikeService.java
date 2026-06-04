package com.project.backend.domain.like.service;

import com.project.backend.domain.like.entity.PromptLike;
import com.project.backend.domain.like.repository.PromptLikeRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PromptLikeService {

    private final PromptLikeRepository promptLikeRepository;
    private final UserRepository userRepository;
    private final PromptRepository promptRepository;


    @Transactional
    public boolean toggleLike(Long promptId, String email) {

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND));

        return promptLikeRepository.findByUserIdAndPromptId(user.getId(), promptId)
                .map(like -> {
                    promptLikeRepository.delete(like);
                    return false;
                })
                .orElseGet(() -> {
                    PromptLike newLike = PromptLike.builder()
                            .user(user)
                            .prompt(prompt)
                            .build();
                    promptLikeRepository.save(newLike);
                    return true;
                });
    }
}