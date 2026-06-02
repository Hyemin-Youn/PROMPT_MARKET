package com.project.backend.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 공통
    INVALID_INPUT(400, "잘못된 입력값입니다."),
    UNAUTHORIZED(401, "인증이 필요합니다."),
    FORBIDDEN(403, "접근 권한이 없습니다."),
    NOT_FOUND(404, "리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(500, "서버 내부 오류입니다."),

    // 이메일 인증
    EMAIL_CODE_EXPIRED(400, "인증 코드가 만료되었습니다."),
    EMAIL_CODE_INVALID(400, "인증 코드가 올바르지 않습니다."),
    EMAIL_NOT_VERIFIED(403, "이메일 인증이 필요합니다."),

    // 유저
    USER_NOT_FOUND(404, "존재하지 않는 회원입니다."),
    EMAIL_DUPLICATED(409, "이미 사용 중인 이메일입니다."),
    NICKNAME_DUPLICATED(409, "이미 사용 중인 닉네임입니다."),

    // 프롬프트
    PROMPT_NOT_FOUND(404, "존재하지 않는 프롬프트입니다."),
    PROMPT_FORBIDDEN(403, "해당 프롬프트에 대한 권한이 없습니다."),

    // 구매
    ALREADY_PURCHASED(409, "이미 구매한 프롬프트입니다."),
    NOT_PURCHASED(403, "구매 후 이용 가능합니다."),

    // 별점
    ALREADY_RATED(409, "이미 별점을 등록했습니다."),
    RATING_ONLY_FOR_BUYER(403, "구매자만 별점을 등록할 수 있습니다.");

    private final int status;
    private final String message;
}