package com.project.backend.domain.user.service;

import com.project.backend.domain.user.Entity.PromptUser;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(request);

        String registrationId = request.getClientRegistration().getRegistrationId();
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, oAuth2User.getAttributes());

        PromptUser user = saveOrUpdate(attributes);

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority(user.getRole().name())),
                oAuth2User.getAttributes(),
                registrationId.equals("kakao")
                        ? "id"
                        : "sub"
        );
    }

    private PromptUser saveOrUpdate(OAuthAttributes attributes) {

        return userRepository.findByEmail(attributes.getEmail())
                .orElseGet(() -> userRepository.save(PromptUser.ofOAuth(
                        attributes.getEmail(),
                        attributes.getNickname()
                )));
    }
}