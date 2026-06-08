import axiosInstance from "./axiosInstance";

export const getMe = () =>
  axiosInstance.get("/api/users/me");

export const updateProfile = (nickname) =>
  axiosInstance.put("/api/users/profile", { nickname });

export const getMyPrompts = () =>
  axiosInstance.get("/api/users/my-prompts");

export const getActivity = () =>
  axiosInstance.get("/api/users/activity");

export const getFollowInfo = () =>
  axiosInstance.get("/api/users/follow-info");

export const getPurchases = () =>
  axiosInstance.get("/api/purchases");

export const purchasePrompt = (promptId) =>
  axiosInstance.post("/api/purchases", { promptId });
