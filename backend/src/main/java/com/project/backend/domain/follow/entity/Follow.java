package com.project.backend.domain.follow.entity;


import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(
        name = "follow",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"follower_id", "following_id"})
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Follow extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Long id;

    // 팔로우를 하는 사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private PromptUser follower;

    // 팔로우를 받는 사람
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private PromptUser following;

    @Builder
    public Follow(PromptUser follower, PromptUser following) {
        this.follower = follower;
        this.following = following;
    }
}
