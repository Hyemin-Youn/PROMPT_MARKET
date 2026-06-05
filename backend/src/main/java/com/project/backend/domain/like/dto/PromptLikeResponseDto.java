package com.project.backend.domain.like.dto;


import com.project.backend.domain.like.entity.PromptLike;
import lombok.Getter;

@Getter
public class PromptLikeResponseDto {
    private final Long promptId;
    private final String title;
    private final String authorNickname;

    public PromptLikeResponseDto(PromptLike promptLike) {
        this.promptId = promptLike.getPrompt().getId();
        this.title = promptLike.getPrompt().getTitle();
        this.authorNickname = promptLike.getPrompt().getUser().getNickname();
    }
}
