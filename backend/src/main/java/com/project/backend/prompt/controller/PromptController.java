package com.project.backend.prompt.controller;

import com.project.backend.prompt.dto.PromptCreateRequest;
import com.project.backend.prompt.dto.PromptDetailResponse;
import com.project.backend.prompt.dto.PromptListResponse;
import com.project.backend.prompt.dto.PromptUpdateRequest;
import com.project.backend.prompt.service.PromptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    /**
     * 게시글 등록
     * 임시로 userId를 RequestParam으로 받음
     */

    @PostMapping
    public Long createPrompt(
            @RequestParam Long userId,
            @Valid @RequestBody PromptCreateRequest request
    ) {
        return promptService.createPrompt(userId, request);
    }

    /**
     * 게시글 목록 조회
     */
    @GetMapping
    public List<PromptListResponse> getPromptList() {
        return promptService.getPromptList();
    }

    /**
     * 게시글 상세 조회
     * 상세 조회 시 조회수 증가
     */
    @GetMapping("/{promptId}")
    public PromptDetailResponse getPromptDetail(
            @PathVariable Long promptId
    ) {
        return promptService.getPromptDetail(promptId);
    }

    /**
     * 게시글 수정
     * 작성자 본인만 가능
     */
    @PutMapping("/{promptId}")
    public void updatePrompt(
            @PathVariable Long promptId,
            @RequestParam Long userId,
            @Valid @RequestBody PromptUpdateRequest request
    ) {
        promptService.updatePrompt(promptId, userId, request);
    }

    /**
     * 게시글 삭제
     * 실제 삭제가 아니라 status = DELETED 처리
     */
    @DeleteMapping("/{promptId}")
    public void deletePrompt(
            @PathVariable Long promptId,
            @RequestParam Long userId
    ) {
        promptService.deletePrompt(promptId, userId);
    }

    /**
     * 게시글 숨김 처리
     * status = HIDDEN 처리
     */
    @PatchMapping("/{promptId}/hide")
    public void hidePrompt(
            @PathVariable Long promptId,
            @RequestParam Long userId
    ) {
        promptService.hidePrompt(promptId, userId);
    }
}