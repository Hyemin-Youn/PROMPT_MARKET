package com.project.backend.domain.follow.service;


import com.project.backend.domain.follow.dto.FollowCountResponseDto;
import com.project.backend.domain.follow.dto.FollowResponseDto;
import com.project.backend.domain.follow.entity.Follow;
import com.project.backend.domain.follow.repository.FollowRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    // 팔로우 토글 기능
    @Transactional
    public boolean toggleFollow(Long followingId, String email) {

        PromptUser follower = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        PromptUser following = userRepository.findById(followingId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


        if (follower.getId().equals(following.getId())) {
            throw new CustomException(ErrorCode.INVALID_FOLLOW_REQUEST);
        }


        Optional<Follow> followOptional =
                followRepository.findByFollowerIdAndFollowingId(follower.getId(), following.getId());

        // 팔로우를 하고 있다면 취소, 아니면 팔로우
        if (followOptional.isPresent()) {
            followRepository.delete(followOptional.get());
            return false;
        } else {
            Follow newFollow = Follow.builder()
                    .follower(follower)
                    .following(following)
                    .build();
            followRepository.save(newFollow);
            return true;
        }
    }


    // 팔로윙 목록 가져오기
    public List<FollowResponseDto> getFollowings(String email) {

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Follow> followings = followRepository.findByFollowerId(user.getId());


        return followings.stream()
                .map(follow -> new FollowResponseDto(follow.getFollowing()))
                .toList();
    }


    // 팔로워 목록 가져오기
    public List<FollowResponseDto> getFollowers(String email) {

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Follow> followers = followRepository.findByFollowingId(user.getId());

        return followers.stream()
                .map(follow -> new FollowResponseDto(follow.getFollower()))
                .toList();
    }

    // 팔로우, 팔로잉 count 정보
    public FollowCountResponseDto getFollowCounts(String email) {

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        long followerCount = followRepository.countByFollowingId(user.getId());
        long followingCount = followRepository.countByFollowerId(user.getId());

        return new FollowCountResponseDto(followerCount, followingCount);
    }
}
