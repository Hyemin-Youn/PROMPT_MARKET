package com.project.backend.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

public class UserRequestDto {

    @Getter
    public static class SignUpRequestDto {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
        private String password;

        @NotBlank
        @Size(min = 2, max = 20)
        private String nickname;
    }

    @Getter
    public static class LoginRequestDto {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }
}
