package com.project.backend.domain.follow.dto;


import com.project.backend.domain.user.entity.PromptUser;
import lombok.Getter;

@Getter
public class FollowResponseDto {

    private final String nickname;
    private final String email;

    public FollowResponseDto(PromptUser user) {
        this.nickname = user.getNickname();
        this.email = user.getEmail();
    }
}
