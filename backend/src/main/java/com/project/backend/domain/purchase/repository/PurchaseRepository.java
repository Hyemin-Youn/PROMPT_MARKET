package com.project.backend.domain.purchase.repository;

import com.project.backend.domain.purchase.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    boolean existsByUserUserIdAndPromptPromptId(Long userId, Long promptId);
}