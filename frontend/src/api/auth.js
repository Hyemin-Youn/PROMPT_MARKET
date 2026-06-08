import axiosInstance from "./axiosInstance";

export const login = (email, password) =>
  axiosInstance.post("/api/auth/login", { email, password });

export const logout = () =>
  axiosInstance.post("/api/auth/logout");

export const sendCode = ({ email, password, name, nickname }) =>
  axiosInstance.post("/api/auth/send-code", { email, password, name, nickname });

export const verifyEmail = (email, code) =>
  axiosInstance.post("/api/auth/verify-email", { email, code });

export const signup = ({ email, password, name, nickname, marketingAgreed }) =>
  axiosInstance.post("/api/auth/signup", { email, password, name, nickname, marketingAgreed });
