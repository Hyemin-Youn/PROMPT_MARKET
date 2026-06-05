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

        if ("github".equals(registrationId)) {
            return ofGithub(attributes);
        }

        return ofGoogle(attributes);
    }

    private static OAuthAttributes ofGoogle(Map<String, Object> attributes) {

        return OAuthAttributes.builder()
                .email((String) attributes.get("email"))
                .nickname((String) attributes.get("name"))
                .build();
    }

    private static OAuthAttributes ofGithub(Map<String, Object> attributes) {
        // 깃허브는 email이 null일 수 있음c
        String email = (String) attributes.get("email");

        if (email == null) {
            email = "github_" + attributes.get("login") + "@promptmart.com";
        }

        return OAuthAttributes.builder()
                .email(email)
                .nickname((String) attributes.get("login"))
                .build();
    }
}