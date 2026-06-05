package com.project.backend.domain.report.dto;

import com.project.backend.domain.report.entity.ReportReason;
import com.project.backend.domain.report.entity.ReportTargetType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReportRequestDto {

    private Long targetId;
    private ReportTargetType reportTargetType;
    private ReportReason reason;
    private String detail;

}