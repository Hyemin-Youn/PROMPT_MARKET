package com.project.backend.domain.purchase.service;

import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.repository.PromptRepository;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PromptRepository promptRepository;
    private final UserRepository userRepository;

    @Transactional
    public PurchaseResponseDto purchase(String email, Long promptId) {
        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND));

        if (purchaseRepository.existsByUserUserIdAndPromptPromptId(user.getId(), promptId)) {
            throw new CustomException(ErrorCode.ALREADY_PURCHASED);
        }

        Purchase purchase = new Purchase(user, prompt, prompt.getPrice());
        purchaseRepository.save(purchase);
        return PurchaseResponseDto.from(purchase);
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponseDto> getPurchaseList(String email) {
        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return purchaseRepository.findAllByUserIdAndStatus(user.getId(), PurchaseStatus.COMPLETE)
                .stream()
                .map(PurchaseResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isPurchased(String email, Long promptId) {
        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return purchaseRepository.existsByUserUserIdAndPromptPromptId(user.getId(), promptId);
    }
}
