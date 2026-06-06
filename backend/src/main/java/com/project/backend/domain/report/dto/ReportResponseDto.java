package com.project.backend.domain.report.dto;

import com.project.backend.domain.report.entity.Report;
import com.project.backend.domain.report.entity.ReportReason;
import com.project.backend.domain.report.entity.ReportStatus;
import com.project.backend.domain.report.entity.ReportTargetType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReportResponseDto {

    private final Long reportId;
    private final Long reporterId;
    private final String reporterNickname;
    private final ReportTargetType reportTargetType;
    private final Long targetId;
    private final String reasonLabel;
    private final String detail;
    private final ReportStatus status;
    private final LocalDateTime createdAt;
    private final String message;


    @Builder
    private ReportResponseDto(Long reportId, Long reporterId, String reporterNickname,
                              ReportTargetType reportTargetType, Long targetId,
                              String reasonLabel, String detail, ReportStatus status, LocalDateTime createdAt, String message) {
        this.reportId = reportId;
        this.reporterId = reporterId;
        this.reporterNickname = reporterNickname;
        this.reportTargetType = reportTargetType;
        this.targetId = targetId;
        this.reasonLabel = reasonLabel;
        this.detail = detail;
        this.status = status;
        this.createdAt = createdAt;
        this.message = message;
    }


    public static ReportResponseDto from(Report report) {
        return ReportResponseDto.builder()
                .reportId(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterNickname(report.getReporter().getNickname())
                .reportTargetType(report.getReportTargetType())
                .targetId(report.getTargetId())
                .reasonLabel(report.getReason().getLabel())
                .detail(report.getDetail())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .message("신고가 정상적으로 접수되었습니다.")
                .build();
    }
}