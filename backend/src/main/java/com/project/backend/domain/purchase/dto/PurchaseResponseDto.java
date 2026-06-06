package com.project.backend.domain.purchase.dto;

import com.project.backend.domain.purchase.entity.Purchase;
import com.project.backend.domain.purchase.entity.PurchaseStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PurchaseResponseDto {
    private Long purchaseId;
    private Long promptId;
    private String promptTitle;
    private int paidPrice;
    private PurchaseStatus status;
    private LocalDateTime purchasedAt;

    public static PurchaseResponseDto from(Purchase purchase) {
        PurchaseResponseDto dto = new PurchaseResponseDto();
        dto.purchaseId = purchase.getPurchaseId();
        dto.promptId = purchase.getPrompt().getPromptId();
        dto.promptTitle = purchase.getPrompt().getTitle();
        dto.paidPrice = purchase.getPaidPrice();
        dto.status = purchase.getStatus();
        dto.purchasedAt = purchase.getPurchasedAt();
        return dto;
    }
}