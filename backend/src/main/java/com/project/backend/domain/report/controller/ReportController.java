package com.project.backend.domain.report.controller;

import com.project.backend.domain.report.dto.ReportRequestDto;
import com.project.backend.domain.report.dto.ReportResponseDto;
import com.project.backend.domain.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}