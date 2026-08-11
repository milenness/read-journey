import axios from "axios";
import { useAuthStore } from "@/store/authStore";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.get("/users/current/refresh");

        if (data.token) {
          const { user, setAuth } = useAuthStore.getState();
          if (user) {
            setAuth(user, data.token);
          }

          originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearUser();
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);


export const registerUser = async (
  data: SignUpRequest,
): Promise<AuthResponse> => {
  const res = await axios.post("/users/signup", data);
  return res.data;
};

export const loginUser = async (data: SignInRequest): Promise<AuthResponse> => {
  const res = await axios.post("/users/signin", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post("/users/signout");
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await axios.get("/users/current");
  return res.data;
};

export const refreshUserToken = async () => {
  const res = await axios.get("/users/current/refresh");
  return res.data;
};
