package com.project.backend.domain.report.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportStatus {

    PENDING("처리중"), RESOLVED("처리완료"), REJECTED("반려");

    private final String label;
}