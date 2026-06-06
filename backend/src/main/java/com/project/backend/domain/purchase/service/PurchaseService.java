package com.project.backend.domain.purchase.service;

import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.repository.PromptRepository;
import com.project.backend.domain.purchase.dto.PurchaseRequestDto;
import com.project.backend.domain.purchase.dto.PurchaseResponseDto;
import com.project.backend.domain.purchase.entity.Purchase;
import com.project.backend.domain.purchase.entity.PurchaseStatus;
import com.project.backend.domain.purchase.repository.PurchaseRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PromptRepository promptRepository;
    private final UserRepository userRepository;

    @Transactional
    public PurchaseResponseDto purchase(String email, PurchaseRequestDto dto) {
        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Prompt prompt = promptRepository.findById(dto.getPromptId())
                .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND));

        if (purchaseRepository.existsByUserUserIdAndPromptPromptId(user.getUserId(), prompt.getPromptId())) {
            throw new CustomException(ErrorCode.ALREADY_PURCHASED);
        }

        Purchase purchase = new Purchase(user, prompt, prompt.getPrice());
        purchaseRepository.save(purchase);
        return PurchaseResponseDto.from(purchase);
    }
}