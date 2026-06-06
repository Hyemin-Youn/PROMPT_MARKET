package com.project.backend.domain.report.service;

import com.project.backend.domain.comment.entity.Comment;
import com.project.backend.domain.comment.repository.CommentRepository;
import com.project.backend.domain.prompt.entity.PromptStatus;
import com.project.backend.domain.prompt.repository.PromptRepository;
import com.project.backend.domain.report.dto.ReportProcessRequestDto;
import com.project.backend.domain.report.dto.ReportRequestDto;
import com.project.backend.domain.report.dto.ReportResponseDto;
import com.project.backend.domain.report.entity.Report;
import com.project.backend.domain.report.entity.ReportStatus;
import com.project.backend.domain.report.entity.ReportTargetType;
import com.project.backend.domain.report.repository.ReportRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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


    // 신고 대상 검증 메서드: switch~case를 활용하여 prompt/comment/user 신고 구분
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


    // 본인 신고 검증 메서드
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



    /**
     *  관리자용 메서드
     */

    // 전체 신고 목록 조회(관리자용)
    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(ReportResponseDto::from)
                .toList();
    }


    // 신고건 처리(관리자용)
    @Transactional
    public ReportResponseDto processReport(Long reportId, ReportProcessRequestDto requestDto) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new CustomException(ErrorCode.REPORT_ALREADY_PROCESSED);
        }

        report.updateReportStatus(requestDto.getStatus());


        if (requestDto.getStatus() == ReportStatus.RESOLVED) {
            completeProcessedReport(report.getReportTargetType(), report.getTargetId());
        }

        return ReportResponseDto.from(report);
    }

    // 처리가 완료된 신고건을 처리하는 메서드(Prompt:HIDDEN/Comment:DELETED/User:SUSPENDED)
    private void completeProcessedReport(ReportTargetType targetType, Long targetId) {
        switch (targetType) {
            case PROMPT -> promptRepository.findById(targetId).ifPresent(prompt -> {
                prompt.updateStatus(PromptStatus.HIDDEN);
            });

            case COMMENT -> commentRepository.findById(targetId).ifPresent(Comment::deleteComment);

            case USER -> userRepository.findById(targetId).ifPresent(user -> {
                user.updateStatus(PromptUser.Status.SUSPENDED);
            });
        }
    }
}
