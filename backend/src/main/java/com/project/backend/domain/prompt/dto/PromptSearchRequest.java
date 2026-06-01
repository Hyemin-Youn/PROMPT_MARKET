package com.project.backend.domain.prompt.dto;

import com.project.backend.domain.prompt.entity.AiType;
import com.project.backend.domain.prompt.entity.PromptCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromptSearchRequest {

    private String keyword;
    private PromptCategory category;
    private AiType aiType;
}
