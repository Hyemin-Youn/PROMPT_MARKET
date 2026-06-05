package com.project.backend.domain.like.service;

import com.project.backend.domain.like.dto.PromptLikeResponseDto;
import com.project.backend.domain.like.entity.PromptLike;
import com.project.backend.domain.like.repository.PromptLikeRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PromptLikeService {

    private final PromptLikeRepository promptLikeRepository;
    private final UserRepository userRepository;
    private final PromptRepository promptRepository;


    // '좋아요'토글 기능
    @Transactional
    public boolean toggleLike(Long promptId, String email) {

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND));

        Optional<PromptLike> promptLikeOptional =
                promptLikeRepository.findByUserIdAndPromptId(user.getId(), promptId);

        if (promptLikeOptional.isPresent()) {
            promptLikeRepository.delete(promptLikeOptional.get());
            return false;
        } else {
            PromptLike newLike = PromptLike.builder()
                    .user(user)
                    .prompt(prompt)
                    .build();
            promptLikeRepository.save(newLike);
            return true;
        }
    }


    // '좋아요'표시한 프롬프트 목록 가져오기
    public List<PromptLikeResponseDto> getMyLikedPrompts(String email) {

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<PromptLike> likeList = promptLikeRepository.findByUserId(user.getId());

        return likeList.stream()
                .map(PromptLikeResponseDto::new)
                .toList();
    }
}