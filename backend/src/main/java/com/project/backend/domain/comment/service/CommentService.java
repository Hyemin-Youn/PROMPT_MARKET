package com.project.backend.domain.comment.service;

import com.project.backend.domain.comment.dto.CommentRequestDto;
import com.project.backend.domain.comment.dto.CommentResponseDto;
import com.project.backend.domain.comment.entity.Comment;
import com.project.backend.domain.comment.repository.CommentRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PromptRepository promptRepository;


    @Transactional
    public CommentResponseDto createComment(Long promptId, String email, CommentRequestDto requestDto) {

        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROMPT_NOT_FOUND));


        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Comment comment = Comment.builder()
                .content(requestDto.getContent())
                .prompt(prompt)
                .user(user)
                .build();

        Comment savedComment = commentRepository.save(comment);

        return new CommentResponseDto.from(savedComment);
    }


    @Transactional
    public CommentResponseDto updateComment(Long commentId, String email, CommentRequestDto requestDto) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        if (!comment.getUser().getId().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        comment.updateContent(requestDto.getContent());

        return new CommentResponseDto.from(comment);
    }


    @Transactional
    public void deleteComment(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        if (!comment.getUser().getId().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        comment.deleteComment();
    }
}