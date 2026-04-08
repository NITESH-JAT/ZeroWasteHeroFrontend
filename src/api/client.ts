import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAppStore } from "../store/useAppStore";

// Your live Railway backend URL! 
// Note: Always use https:// for production URLs
const BASE_URL = "https://zerowasteherobackend-production.up.railway.app/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ---
// Before any request leaves the app, this function grabs the token from the 
// secure vault and attaches it to the headers.
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("zeroWasteHero_jwtToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
// When the backend replies, this checks if the server rejected the token (401 Expired).
// If the token is dead, it automatically triggers Zustand to log the user out!
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Logging out automatically.");
      
      // Grab the logout function directly from Zustand memory without hooks
      const logoutUser = useAppStore.getState().logoutUser;
      await logoutUser();
    }
    return Promise.reject(error);
  }
);