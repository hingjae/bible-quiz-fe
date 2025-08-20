import { defineStore } from "pinia";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    topicId: null as number | null,
    topicLabel: null as string | null,
  }),
  getters: {
    hasTopic: (s) => s.topicId != null,
  },
  actions: {
    setTopic(id: number, label?: string) {
      this.topicId = id;
      this.topicLabel = label ?? null;

      // 새로고침 대비 백업
      sessionStorage.setItem("topicId", String(id));
      if (label) sessionStorage.setItem("topicLabel", label);
      else sessionStorage.removeItem("topicLabel");
    },
    hydrateFromSession() {
      if (this.topicId == null) {
        const rawId = sessionStorage.getItem("topicId");
        if (rawId) {
          const n = Number(rawId);
          if (Number.isFinite(n)) this.topicId = n;
        }
      }
      if (this.topicLabel == null) {
        const rawLabel = sessionStorage.getItem("topicLabel");
        if (rawLabel) this.topicLabel = rawLabel;
      }
    },
    clear() {
      this.topicId = null;
      this.topicLabel = null;
      sessionStorage.removeItem("topicId");
      sessionStorage.removeItem("topicLabel");
    },
  },
});
