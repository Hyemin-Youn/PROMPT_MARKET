package com.project.backend.global.exception;


import com.project.backend.global.common.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.validation.BindException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 커스텀 예외
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {

        ErrorCode code = e.getErrorCode();

        return ResponseEntity
                .status(code.getStatus())
                .body(ApiResponse.fail(code.getMessage()));
    }

    // @Valid 검증 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidException(MethodArgumentNotValidException e) {

        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("입력값이 올바르지 않습니다.");

        return ResponseEntity
                .badRequest()
                .body(ApiResponse.fail(message));
    }

    // @ModelAttribute 바인딩 실패 (잘못된 enum 값 등)
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Void>> handleBindException(BindException e) {

        String message = e.getFieldErrors().stream()
                .map(error -> error.getField() + "의 입력값이 올바르지 않습니다.")
                .findFirst()
                .orElse("요청 파라미터가 올바르지 않습니다.");

        return ResponseEntity
                .badRequest()
                .body(ApiResponse.fail(message));
    }

    // 정적 리소스 없음 (favicon.ico 등) — 404로 조용히 처리
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResourceFound(NoResourceFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.fail("요청한 리소스를 찾을 수 없습니다."));
    }

    // 나머지 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("[500 ERROR] {} : {}", e.getClass().getSimpleName(), e.getMessage(), e);
        return ResponseEntity
                .internalServerError()
                .body(ApiResponse.fail(ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
    }
}