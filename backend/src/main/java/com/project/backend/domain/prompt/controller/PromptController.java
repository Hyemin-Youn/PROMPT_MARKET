package com.project.backend.domain.prompt.controller;

import com.project.backend.domain.prompt.dto.PromptSearchRequest;
import com.project.backend.domain.prompt.dto.PromptSearchResponse;
import com.project.backend.domain.prompt.service.PromptService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PromptSearchResponse>>> search(
            @Valid @ModelAttribute PromptSearchRequest request,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PromptSearchResponse> result = promptService.search(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
