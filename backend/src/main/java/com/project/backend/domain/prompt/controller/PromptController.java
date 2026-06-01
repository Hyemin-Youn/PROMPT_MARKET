package com.project.backend.domain.prompt.controller;

import com.project.backend.domain.prompt.dto.PromptSearchRequest;
import com.project.backend.domain.prompt.dto.PromptSearchResponse;
import com.project.backend.domain.prompt.service.PromptService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromptSearchResponse>>> search(
            @ModelAttribute PromptSearchRequest request) {
        List<PromptSearchResponse> result = promptService.search(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
