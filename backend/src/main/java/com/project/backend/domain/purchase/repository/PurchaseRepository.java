package com.project.backend.domain.purchase.repository;

import com.project.backend.domain.purchase.entity.Purchase;
import com.project.backend.domain.purchase.entity.PurchaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    boolean existsByUserUserIdAndPromptPromptId(Long userId, Long promptId);

    List<Purchase> findAllByUserIdAndStatus(Long userId, PurchaseStatus status);
}