package com.project.backend.prompt.dto;

import com.project.backend.prompt.enums.AiType;
import com.project.backend.prompt.enums.PromptCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PromptUpdateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "본문은 필수입니다.")
    private String content;

    @NotBlank(message = "미리보기는 필수입니다.")
    private String preview;

    private String thumbnailUrl;

    @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
    private int price;

    @NotNull(message = "카테고리는 필수입니다.")
    private PromptCategory category;

    @NotNull(message = "AI 종류는 필수입니다.")
    private AiType aiType;


}
