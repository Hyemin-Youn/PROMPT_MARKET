package com.project.backend.domain.follow.service;


import com.project.backend.domain.follow.entity.Follow;
import com.project.backend.domain.follow.repository.FollowRepository;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean toggleFollow(Long followingId, String email) {

        PromptUser follower = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        PromptUser following = userRepository.findById(followingId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


        if (follower.getId().equals(following.getId())) {
            throw new CustomException(ErrorCode.INVALID_FOLLOW_REQUEST);
        }


        return followRepository.findByFollowerIdAndFollowingId(follower.getId(), following.getId())
                .map(follow -> {
                    followRepository.delete(follow);
                    return false;
                })
                .orElseGet(() -> {
                    Follow newFollow = Follow.builder()
                            .follower(follower)
                            .following(following)
                            .build();
                    followRepository.save(newFollow);
                    return true;
                });
    }
}
