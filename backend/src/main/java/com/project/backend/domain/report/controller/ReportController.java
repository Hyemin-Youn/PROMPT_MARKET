package com.project.backend.domain.report.controller;

import com.project.backend.domain.report.dto.ReportProcessRequestDto;
import com.project.backend.domain.report.dto.ReportRequestDto;
import com.project.backend.domain.report.dto.ReportResponseDto;
import com.project.backend.domain.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> createReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ReportRequestDto requestDto
    ) {
        String email = userDetails.getUsername();

        ReportResponseDto responseDto = reportService.createReport(email, requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /**
     * 관리자용 controller
     */
    // 전체 신고 목록 조회 (관리자용)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        List<ReportResponseDto> response = reportService.getAllReports();

        return ResponseEntity.ok(response);
    }


    // 특정 신고 건 처리 (관리자용)
    @PatchMapping("/admin/{reportId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponseDto> processReport(
            @PathVariable Long reportId,
            @RequestBody ReportProcessRequestDto requestDto
    ) {
        ReportResponseDto response = reportService.processReport(reportId, requestDto);

        return ResponseEntity.ok(response);
    }
}