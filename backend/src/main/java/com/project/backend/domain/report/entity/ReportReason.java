package com.project.backend.domain.report.entity;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportReason {
    SPAM("스팸/광고"), ABUSE("욕설/비방"), COPYRIGHT("저작권 침해"), ETC("기타 사유");

    private final String label;
}
