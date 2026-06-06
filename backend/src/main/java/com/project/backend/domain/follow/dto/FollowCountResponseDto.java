package com.project.backend.domain.follow.dto;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class FollowCountResponseDto {

    private final long followerCount;
    private final long followingCount;
}
