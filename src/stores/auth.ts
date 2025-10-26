import apiClient from "@/api/axios";
import { defineStore } from "pinia";

interface AuthSate {
  accessToken: string | null;
}

const TOKEN_KEY = "accessToken" as const;

export const useAuthStore = defineStore("auth", {
  state: (): AuthSate => ({
    accessToken: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.accessToken !== null,

    token: (state): string | null => state.accessToken,
  },

  actions: {
    /**
     * 앱 초기화 시 localStorage에서 토큰 복원
     */
    initialize(): void {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        this.accessToken = token;
      }
    },

    /**
     * 엑세스 토큰 설정
     */
    setAccessToken(token: string): void {
      this.accessToken = token;
      localStorage.setItem(TOKEN_KEY, token);
    },

    clear(): void {
      this.accessToken = null;
      localStorage.removeItem(TOKEN_KEY);
    },

    async logout() {
      try {
        await apiClient.post("/api/auth/logout");
      } catch (error) {
        console.warn("Logout request failed: ", error);
      } finally {
        this.clear();
      }
    },
  },
});
