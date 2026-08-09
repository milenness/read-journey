import axios from "axios";

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
};

export const registerUser = async (data: SignUpRequest) => {
  const res = await axios.post("/api/auth/register", data);
  return res.data;
};

export const loginUser = async (data: SignInRequest) => {
  const res = await axios.post("/api/auth/login", data);
  return res.data;
};
