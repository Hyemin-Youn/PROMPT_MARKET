package com.project.backend.domain.prompt.service;

import com.project.backend.domain.prompt.dto.PromptSearchRequest;
import com.project.backend.domain.prompt.dto.PromptSearchResponse;
import com.project.backend.domain.prompt.repository.PromptRepository;
import com.project.backend.domain.prompt.repository.PromptSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PromptService {

    private final PromptRepository promptRepository;

    public List<PromptSearchResponse> search(PromptSearchRequest request) {
        Specification<com.project.backend.domain.prompt.entity.Prompt> spec = Specification
                .where(PromptSpecification.isActive())
                .and(PromptSpecification.hasKeyword(request.getKeyword()))
                .and(PromptSpecification.hasCategory(request.getCategory()))
                .and(PromptSpecification.hasAiType(request.getAiType()));

        return promptRepository.findAll(spec).stream()
                .map(PromptSearchResponse::from)
                .toList();
    }
}
