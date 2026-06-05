package com.project.backend.prompt.service;

import com.project.backend.prompt.dto.PromptCreateRequest;
import com.project.backend.prompt.dto.PromptDetailResponse;
import com.project.backend.prompt.dto.PromptListResponse;
import com.project.backend.prompt.dto.PromptUpdateRequest;
import com.project.backend.prompt.entity.Prompt;
import com.project.backend.prompt.enums.PromptStatus;
import com.project.backend.prompt.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PromptService {

    // DB 접근
    private final PromptRepository promptRepository;

    // 게시글 등록
    public Long createPrompt(Long userId, PromptCreateRequest request) {
        Prompt prompt = Prompt.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .preview(request.getPreview())
                .thumbnailUrl(request.getThumbnailUrl())
                .price(request.getPrice())
                .category(request.getCategory())
                .aiType(request.getAiType())
                .build();

        return promptRepository.save(prompt).getId();
    }


    // 게시글 목록 조회 ACTIVE 상태인 게시글만 최신순 조회
    @Transactional(readOnly = true)
    public List<PromptListResponse> getPromptList() {
        return promptRepository.findByStatusOrderByCreatedAtDesc(PromptStatus.ACTIVE)
                .stream()
                .map(PromptListResponse::from)
                .toList();
    }

    // 게시글 상세 조회, 조회수 1증가
    public PromptDetailResponse getPromptDetail(Long promptId) {
        Prompt prompt = findPrompt(promptId);


        // 삭제 또는 숨김 게시글 검증
        validateVisiblePrompt(prompt);

        // 조회수 증가
        prompt.increaseViewCount();

        return PromptDetailResponse.from(prompt);
    }

    // 게시글 수정, 작성자 본인만 가능
    public void updatePrompt(Long promptId, Long userId, PromptUpdateRequest request) {
        Prompt prompt = findPrompt(promptId);

        validateOwner(prompt, userId);
        validateNotDeleted(prompt);

        prompt.update(
                request.getTitle(),
                request.getContent(),
                request.getPreview(),
                request.getThumbnailUrl(),
                request.getPrice(),
                request.getCategory(),
                request.getAiType()
        );
    }

    // 게시글 삭제, 실제 삭제 아닌 상태값 DELETED 변경
    public void deletePrompt(Long promptId, Long userId) {
        Prompt prompt = findPrompt(promptId);

        validateOwner(prompt, userId);
        validateNotDeleted(prompt);

        prompt.delete();
    }

    // 게시글 숨김, 상태값 HIDDEN 변경
    public void hidePrompt(Long promptId, Long userId) {
        Prompt prompt = findPrompt(promptId);

        validateOwner(prompt, userId);
        validateNotDeleted(prompt);

        prompt.hide();
    }

    // 게시글 조회 공통 메서드
    private Prompt findPrompt(Long promptId) {
        return promptRepository.findById(promptId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
    }

    // 작성자 본인 여부 검증
    private void validateOwner(Prompt prompt, Long userId) {
        if (!prompt.isOwner(userId)) {
            throw new AccessDeniedException("게시글 수정/삭제 권한이 없습니다.");
        }
    }

    // 상세 조회 가능한 게시글인지 검증
    private void validateVisiblePrompt(Prompt prompt) {
        if (prompt.getStatus() == PromptStatus.DELETED) {
            throw new IllegalArgumentException("삭제된 게시글입니다.");
        }

        if (prompt.getStatus() == PromptStatus.HIDDEN) {
            throw new IllegalArgumentException("숨김 처리된 게시글입니다.");
        }
    }

    // 이미 삭제된 게시글인지 검증
    private void validateNotDeleted(Prompt prompt) {
        if (prompt.getStatus() == PromptStatus.DELETED) {
            throw new IllegalArgumentException("이미 삭제된 게시글입니다.");
        }
    }
}