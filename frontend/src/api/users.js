import axiosInstance from "./axiosInstance";

export const getMyPrompts = () =>
  axiosInstance.get("/api/users/my-prompts");

export const getActivity = () =>
  axiosInstance.get("/api/users/activity");

export const getFollowInfo = () =>
  axiosInstance.get("/api/users/follow-info");

export const getPurchases = () =>
  axiosInstance.get("/api/purchases");
