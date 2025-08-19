import { defineStore } from "pinia";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    topicId: null as number | null,
  }),
  actions: {
    setTopic(id: number) {
      this.topicId = id;
      sessionStorage.setItem("topicId", String(id));
    },
    hydrateFromSession() {
      if (this.topicId != null) return;
      const raw = sessionStorage.getItem("topicId");
      if (raw) {
        const n = Number(raw);
        if (Number.isFinite(n)) this.topicId = n;
      }
    },
    clear() {
      this.topicId = null;
      sessionStorage.removeItem("topicId");
    },
  },
});
