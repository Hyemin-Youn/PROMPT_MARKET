package com.project.backend.domain.prompt.repository;

import com.project.backend.domain.prompt.entity.AiType;
import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.entity.PromptCategory;
import com.project.backend.domain.prompt.entity.PromptStatus;
import org.springframework.data.jpa.domain.Specification;

public class PromptSpecification {

    public static Specification<Prompt> isActive() {
        return (root, query, cb) ->
                cb.equal(root.get("status"), PromptStatus.ACTIVE);
    }

    public static Specification<Prompt> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String pattern = "%" + keyword + "%";
            return cb.or(
                    cb.like(root.get("title"), pattern),
                    cb.like(root.get("content"), pattern)
            );
        };
    }

    public static Specification<Prompt> hasCategory(PromptCategory category) {
        return (root, query, cb) ->
                category == null ? null : cb.equal(root.get("category"), category);
    }

    public static Specification<Prompt> hasAiType(AiType aiType) {
        return (root, query, cb) ->
                aiType == null ? null : cb.equal(root.get("aiType"), aiType);
    }
}
