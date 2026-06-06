package com.project.backend.domain.report.dto;


import com.project.backend.domain.report.entity.ReportStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportProcessRequestDto {

    private ReportStatus status;
}
