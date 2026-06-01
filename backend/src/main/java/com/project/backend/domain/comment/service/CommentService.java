package com.project.backend.domain.comment.service;

import com.project.backend.domain.comment.dto.CommentRequestDto;
import com.project.backend.domain.comment.dto.CommentResponseDto;
import com.project.backend.domain.comment.entity.Comment;
import com.project.backend.domain.comment.repository.CommentRepository;
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
    public CommentResponseDto createComment(Long promptId, Long userId, CommentRequestDto requestDto) {

        Prompt prompt = promptRepository.findById(promptId)
                .orElseThrow(() -> new IllegalArgumentException("해당 프롬프트가 존재하지 않습니다."));


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        Comment comment = Comment.builder()
                .content(requestDto.getContent())
                .prompt(prompt)
                .user(user)
                .build();

        Comment savedComment = commentRepository.save(comment);

        return new CommentResponseDto(savedComment);
    }


    @Transactional
    public CommentResponseDto updateComment(Long commentId, Long userId, CommentRequestDto requestDto) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("해당 댓글을 수정할 권한이 없습니다.");
        }

        comment.updateContent(requestDto.getContent());

        return new CommentResponseDto(comment);
    }


    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("해당 댓글을 삭제할 권한이 없습니다.");
        }

        comment.deleteComment();
    }
}