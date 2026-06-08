package com.project.backend.domain.user.service;

import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.dto.OAuthAttributes;
import com.project.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    // 신규 OAuth 유저 이메일을 임시 보관 — 성공 핸들러에서 읽고 즉시 삭제
    private final Set<String> pendingNewUsers = Collections.newSetFromMap(new ConcurrentHashMap<>());

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(request);

        String registrationId = request.getClientRegistration().getRegistrationId();
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, oAuth2User.getAttributes());

        PromptUser user = saveOrUpdate(attributes);

        // 깃허브는 "login", 구글은 "sub" 을 nameAttributeKey로 사용
        String nameAttributeKey = registrationId.equals("google")
                ? "sub"
                : "login";

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority(user.getRole().name())),
                oAuth2User.getAttributes(),
                nameAttributeKey
        );
    }

    private PromptUser saveOrUpdate(OAuthAttributes attributes) {
        return userRepository.findByEmail(attributes.getEmail())
                .orElseGet(() -> {
                    pendingNewUsers.add(attributes.getEmail());
                    return userRepository.save(PromptUser.ofOAuth(
                            attributes.getEmail(),
                            attributes.getNickname()
                    ));
                });
    }

    /** 신규 유저 여부 확인 — 호출 즉시 Set에서 제거 (한 번만 사용) */
    public boolean consumeNewUserFlag(String email) {
        return pendingNewUsers.remove(email);
    }
}