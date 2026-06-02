package com.project.backend.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class OAuthAttributes {

    private String email;
    private String nickname;

    public static OAuthAttributes of(
            String registrationId,
            Map<String, Object> attributes
    ) {

        if ("kakao".equals(registrationId)) {
            return ofKakao(attributes);
        }

        return ofGoogle(attributes);
    }

    private static OAuthAttributes ofGoogle(Map<String, Object> attributes) {

        return OAuthAttributes.builder()
                .email((String) attributes.get("email"))
                .nickname((String) attributes.get("name"))
                .build();
    }

    @SuppressWarnings("unchecked")
    private static OAuthAttributes ofKakao(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        return OAuthAttributes.builder()
                .email((String) kakaoAccount.get("email"))
                .nickname((String) profile.get("nickname"))
                .build();
    }
}