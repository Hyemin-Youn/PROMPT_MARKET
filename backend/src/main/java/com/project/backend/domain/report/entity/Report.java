package com.project.backend.domain.report.entity;

import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "report")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;

    // 신고를 한 사람 (N:1 연관관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private PromptUser reporter;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private ReportTargetType reportTargetType;


    @Column(name = "target_id", nullable = false)
    private Long targetId;


    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false)
    private ReportReason reason;


    @Column(name = "detail", length = 500)
    private String detail;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status;


    @Builder
    public Report(PromptUser reporter, ReportTargetType reportTargetType, Long targetId, ReportReason reason, String detail, ReportStatus status) {
        this.reporter = reporter;
        this.reportTargetType = reportTargetType;
        this.targetId = targetId;
        this.reason = reason;
        this.detail = detail;

        this.status = status != null ? status : ReportStatus.PENDING;
    }


    public void updateReportStatus(ReportStatus status) {
        this.status = status;
    }
}