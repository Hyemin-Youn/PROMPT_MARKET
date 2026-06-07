package com.project.backend.domain.purchase.controller;

import com.project.backend.domain.purchase.dto.PurchaseRequestDto;
import com.project.backend.domain.purchase.dto.PurchaseResponseDto;
import com.project.backend.domain.purchase.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<PurchaseResponseDto> purchase(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PurchaseRequestDto dto) {
        PurchaseResponseDto response = purchaseService.purchase(userDetails.getUsername(), dto.getPromptId());
        return ResponseEntity.ok(response);
    }
}