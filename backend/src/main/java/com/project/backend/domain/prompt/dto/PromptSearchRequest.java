package com.project.backend.domain.prompt.dto;

import com.project.backend.domain.prompt.entity.AiType;
import com.project.backend.domain.prompt.entity.PromptCategory;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PromptSearchRequest {

    @Size(max = 100, message = "검색어는 100자 이하여야 합니다.")
    @Pattern(regexp = "^[\\w\\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?]*$",
             message = "검색어에 허용되지 않는 문자가 포함되어 있습니다.")
    private String keyword;

    private PromptCategory category;  // FRONTEND, BACKEND, AI, DB, ETC

    private AiType aiType;            // GPT4, CLAUDE, GEMINI, ETC
}
