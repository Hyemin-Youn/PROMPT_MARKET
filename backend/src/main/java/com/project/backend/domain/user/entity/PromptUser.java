package com.project.backend.domain.user.entity;

import com.project.backend.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PromptUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;  // OAuth 유저는 null

    @Column(unique = true, nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    // 일반 회원가입
    @Builder
    public PromptUser(
            String email,
            String password,
            String nickname
    ) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    // OAuth 회원가입
    public static PromptUser ofOAuth(
            String email,
            String nickname
    ) {
        PromptUser user = new PromptUser();
        user.email = email;
        user.nickname = nickname;
        return user;
    }


    // 신고당한 계정 상태 변경 (관리자용)
    public void updateStatus(Status status) {
        this.status = status;
    }


    public enum Role { USER, ADMIN }

    public enum Status { ACTIVE, SUSPENDED, DELETED }
}
