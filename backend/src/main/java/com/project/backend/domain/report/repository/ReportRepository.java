package com.project.backend.domain.report.repository;

import com.project.backend.domain.report.entity.Report;
import com.project.backend.domain.report.entity.ReportTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findByReporterIdAndReportTargetTypeAndTargetId(Long reporterId, ReportTargetType targetType, Long targetId);
}
