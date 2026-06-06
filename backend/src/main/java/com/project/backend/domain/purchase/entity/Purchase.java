package com.project.backend.domain.purchase.entity;

import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.user.entity.PromptUser;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "purchase", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "prompt_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private PromptUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Column(nullable = false)
    private int paidPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime purchasedAt;

    @PrePersist
    private void prePersist() {
        this.purchasedAt = LocalDateTime.now();
        this.status = PurchaseStatus.COMPLETE;
    }

    public Purchase(PromptUser user, Prompt prompt, int paidPrice) {
        this.user = user;
        this.prompt = prompt;
        this.paidPrice = paidPrice;
    }
}
