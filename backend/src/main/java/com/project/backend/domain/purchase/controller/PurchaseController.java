package com.project.backend.domain.purchase.controller;

import com.project.backend.domain.purchase.dto.PurchaseRequestDto;
import com.project.backend.domain.purchase.dto.PurchaseResponseDto;
import com.project.backend.domain.purchase.service.PurchaseService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    // 1. 구매하기
    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseResponseDto>> purchase(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PurchaseRequestDto dto) {
        PurchaseResponseDto response = purchaseService.purchase(userDetails.getUsername(), dto.getPromptId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 2. 내 구매 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseResponseDto>>> getPurchaseList(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PurchaseResponseDto> response = purchaseService.getPurchaseList(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 3. 구매 여부 확인
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> isPurchased(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long promptId) {
        boolean purchased = purchaseService.isPurchased(userDetails.getUsername(), promptId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("purchased", purchased)));
    }
}