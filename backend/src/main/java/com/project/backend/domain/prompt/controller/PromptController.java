package com.project.backend.domain.prompt.controller;

import com.project.backend.domain.prompt.dto.*;
import com.project.backend.domain.prompt.service.PromptService;
import com.project.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PromptSearchResponse>>> search(
            @Valid @ModelAttribute PromptSearchRequest request,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PromptSearchResponse> result = promptService.search(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    public Long createPrompt(
            @RequestParam Long userId,
            @Valid @RequestBody PromptCreateRequest request) {
        return promptService.createPrompt(userId, request);
    }

    @GetMapping
    public List<PromptListResponse> getPromptList() {
        return promptService.getPromptList();
    }

    @GetMapping("/{promptId}")
    public PromptDetailResponse getPromptDetail(@PathVariable Long promptId) {
        return promptService.getPromptDetail(promptId);
    }

    @PutMapping("/{promptId}")
    public void updatePrompt(
            @PathVariable Long promptId,
            @RequestParam Long userId,
            @Valid @RequestBody PromptUpdateRequest request) {
        promptService.updatePrompt(promptId, userId, request);
    }

    @DeleteMapping("/{promptId}")
    public void deletePrompt(
            @PathVariable Long promptId,
            @RequestParam Long userId) {
        promptService.deletePrompt(promptId, userId);
    }

    @PatchMapping("/{promptId}/hide")
    public void hidePrompt(
            @PathVariable Long promptId,
            @RequestParam Long userId) {
        promptService.hidePrompt(promptId, userId);
    }
}
