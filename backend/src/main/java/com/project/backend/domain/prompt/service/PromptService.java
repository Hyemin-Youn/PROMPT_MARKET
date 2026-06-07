package com.project.backend.domain.prompt.service;

import com.project.backend.domain.prompt.dto.*;
import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.entity.PromptStatus;
import com.project.backend.domain.prompt.repository.PromptRepository;
import com.project.backend.domain.prompt.repository.PromptSpecification;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PromptService {

    private final PromptRepository promptRepository;
    private final UserRepository userRepository;

    public Page<PromptSearchResponse> search(PromptSearchRequest request, Pageable pageable) {
        Specification<Prompt> spec = Specification
                .where(PromptSpecification.isActive())
                .and(PromptSpecification.hasKeyword(request.getKeyword()))
                .and(PromptSpecification.hasCategory(request.getCategory()))
                .and(PromptSpecification.hasAiType(request.getAiType()));

        return promptRepository.findAll(spec, pageable)
                .map(PromptSearchResponse::from);
    }

    @Transactional
    public Long createPrompt(Long userId, PromptCreateRequest request) {
        PromptUser user = findUser(userId);
        Prompt prompt = Prompt.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .preview(request.getPreview())
                .thumbnailUrl(request.getThumbnailUrl())
                .price(request.getPrice())
                .category(request.getCategory())
                .aiType(request.getAiType())
                .build();
        return promptRepository.save(prompt).getPromptId();
    }

    public List<PromptListResponse> getPromptList() {
        return promptRepository.findByStatusOrderByCreatedAtDesc(PromptStatus.ACTIVE)
                .stream()
                .map(PromptListResponse::from)
                .toList();
    }

    @Transactional
    public PromptDetailResponse getPromptDetail(Long promptId) {
        Prompt prompt = findPrompt(promptId);
        validateVisiblePrompt(prompt);
        prompt.increaseViewCount();
        return PromptDetailResponse.from(prompt);
    }

    @Transactional
    public void updatePrompt(Long promptId, Long userId, PromptUpdateRequest request) {
        Prompt prompt = findPrompt(promptId);
        validateOwner(prompt, userId);
        validateNotDeleted(prompt);
        prompt.update(request.getTitle(), request.getContent(), request.getPreview(),
                request.getThumbnailUrl(), request.getPrice(), request.getCategory(), request.getAiType());
    }

    @Transactional
    public void deletePrompt(Long promptId, Long userId) {
        Prompt prompt = findPrompt(promptId);
        validateOwner(prompt, userId);
        validateNotDeleted(prompt);
        prompt.delete();
    }

    @Transactional
    public void hidePrompt(Long promptId, Long userId) {
        Prompt prompt = findPrompt(promptId);
        validateOwner(prompt, userId);
        validateNotDeleted(prompt);
        prompt.hide();
    }

    private Prompt findPrompt(Long promptId) {
        return promptRepository.findById(promptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));
    }

    private PromptUser findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    private void validateOwner(Prompt prompt, Long userId) {
        if (!prompt.isOwner(userId)) {
            throw new AccessDeniedException("게시글 수정/삭제 권한이 없습니다.");
        }
    }

    private void validateVisiblePrompt(Prompt prompt) {
        if (prompt.getStatus() == PromptStatus.DELETED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 게시글입니다.");
        }
        if (prompt.getStatus() == PromptStatus.HIDDEN) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "숨김 처리된 게시글입니다.");
        }
    }

    private void validateNotDeleted(Prompt prompt) {
        if (prompt.getStatus() == PromptStatus.DELETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 삭제된 게시글입니다.");
        }
    }
}
