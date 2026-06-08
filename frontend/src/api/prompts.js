import axiosInstance from "./axiosInstance";

export const searchPrompts = (params) =>
  axiosInstance.get("/api/prompts/search", { params });

export const getPrompt = (promptId) =>
  axiosInstance.get(`/api/prompts/${promptId}`);

export const createPrompt = (data) =>
  axiosInstance.post("/api/prompts", data);

export const updatePrompt = (id, data) =>
  axiosInstance.put(`/api/prompts/${id}`, data);

export const deletePrompt = (promptId) =>
  axiosInstance.delete(`/api/prompts/${promptId}`);

export const getComments = (promptId) =>
  axiosInstance.get(`/api/prompts/${promptId}/comments`);

export const postComment = (promptId, content) =>
  axiosInstance.post(`/api/prompts/${promptId}/comments`, { content });

export const checkIsLiked = (promptId) =>
  axiosInstance.get(`/api/prompts/${promptId}/is-liked`);

export const toggleLike = (promptId) =>
  axiosInstance.post(`/api/prompts/${promptId}/likes`);

export const getLikedPrompts = () =>
  axiosInstance.get("/api/prompts/liked");

export const submitReport = ({ targetId, reportTargetType, reason, detail }) =>
  axiosInstance.post("/api/reports", { targetId, reportTargetType, reason, detail });
