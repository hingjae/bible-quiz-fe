import apiClient from "@/api/axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
    },

    clear() {
      {
        this.accessToken = "";
        localStorage.removeItem("accessToken");
      }
    },

    async logout() {
      try {
        await apiClient.post("/api/auth/logout");
      } catch (err) {
        console.warn("Logout request failed: ", err);
      } finally {
        this.clear();
      }
    },
  },
});
