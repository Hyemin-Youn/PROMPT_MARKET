package com.project.backend.domain.report.service;

import com.project.backend.domain.comment.repository.CommentRepository;
import com.project.backend.domain.prompt.repository.PromptRepository;
import com.project.backend.domain.report.dto.ReportRequestDto;
import com.project.backend.domain.report.dto.ReportResponseDto;
import com.project.backend.domain.report.entity.Report;
import com.project.backend.domain.report.entity.ReportTargetType;
import com.project.backend.domain.report.repository.ReportRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PromptRepository promptRepository;
    private final CommentRepository commentRepository;


    @Transactional
    public ReportResponseDto createReport(String email, ReportRequestDto requestDto) {

        PromptUser reporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


        // 신고 대상 검증
        validateTargetExists(requestDto.getReportTargetType(), requestDto.getTargetId());

        // 본인 신고 검증
        validateSelfReport(reporter.getId(), requestDto.getReportTargetType(), requestDto.getTargetId());

        // 중복 신고 방지
        reportRepository.findByReporterIdAndReportTargetTypeAndTargetId(
                        reporter.getId(), requestDto.getReportTargetType(), requestDto.getTargetId())
                .ifPresent(report -> {
                    throw new CustomException(ErrorCode.ALREADY_REPORTED);
                });

        // 검증 후 report객체 빌드
        Report report = Report.builder()
                .reporter(reporter)
                .reportTargetType(requestDto.getReportTargetType())
                .targetId(requestDto.getTargetId())
                .reason(requestDto.getReason())
                .detail(requestDto.getDetail())
                .build();

        Report savedReport = reportRepository.save(report);

        return ReportResponseDto.from(savedReport);
    }


    // 신고 대상 검증 : switch~case를 활용하여 prompt/comment/user 신고 구분
    private void validateTargetExists(ReportTargetType targetType, Long targetId) {
        switch (targetType) {
            case PROMPT -> promptRepository.findById(targetId)
                    .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND));
            case COMMENT -> commentRepository.findById(targetId)
                    .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
            case USER -> userRepository.findById(targetId)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }
    }


    // 본인 신고 검증
    private void validateSelfReport(Long reporterId, ReportTargetType targetType, Long targetId) {
        Long ownerId = switch (targetType) {
            case PROMPT -> promptRepository.findById(targetId)
                    .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND))
                    .getUser().getId();
            case COMMENT -> commentRepository.findById(targetId)
                    .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND))
                    .getUser().getId();
            case USER -> targetId;
        };

        if (reporterId.equals(ownerId)) {
            throw new CustomException(ErrorCode.SELF_REPORT_NOT_ALLOWED);
        }
    }
}
