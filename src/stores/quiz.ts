import { defineStore } from "pinia";

interface QuizState {
  topicId: number | null;
  topicLabel: string | null;
}

interface TopicInfo {
  id: number;
  label?: string;
}

const STORAGE_KEYS = {
  TOPIC_ID: "topicId",
  TOPIC_LABEL: "topicLabel",
} as const;

export const useQuizStore = defineStore("quiz", {
  state: (): QuizState => ({
    topicId: null,
    topicLabel: null,
  }),

  getters: {
    /**
     * 토픽이 설정되어 있는지 확인
     */
    hasTopic: (state): boolean => state.topicId !== null,

    /**
     * 현재 토픽 정보 반환
     */
    currentTopic: (state): TopicInfo | null => {
      if (state.topicId === null) {
        return null;
      }

      return {
        id: state.topicId,
        label: state.topicLabel ?? undefined,
      };
    },
  },

  actions: {
    /**
     * 토픽 설정
     * @param id - 토픽 ID
     * @param label - 토픽 레이블
     */
    setTopic(id: number, label?: string): void {
      this.topicId = id;
      this.topicLabel = label ?? null;

      // 새로고침 대비 백업
      this.saveToSession();
    },

    /**
     * sessionStorage에서 토픽 정보 복원
     * 새로고침 시 상태 유지용
     */
    hydrateFromSession(): void {
      if (this.topicId !== null) return;

      const savedId = this.getNumberFromSession(STORAGE_KEYS.TOPIC_ID);
      if (savedId !== null) {
        this.topicId = savedId;
      }

      const savedLabel = sessionStorage.getItem(STORAGE_KEYS.TOPIC_LABEL);
      if (savedLabel) {
        this.topicLabel = savedLabel;
      }
    },

    /**
     * 토픽 정보 초기화
     */
    clear() {
      this.topicId = null;
      this.topicLabel = null;
      this.clearSession();
    },

    /**
     * sessionStorage에 현재 상태 저장
     */
    saveToSession(): void {
      if (this.topicId !== null) {
        sessionStorage.setItem(STORAGE_KEYS.TOPIC_ID, String(this.topicId));
      }

      if (this.topicLabel) {
        sessionStorage.setItem(STORAGE_KEYS.TOPIC_LABEL, this.topicLabel);
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.TOPIC_LABEL);
      }
    },

    /**
     * sessionStorage 초기화
     */
    clearSession(): void {
      sessionStorage.removeItem(STORAGE_KEYS.TOPIC_ID);
      sessionStorage.removeItem(STORAGE_KEYS.TOPIC_LABEL);
    },

    /**
     * sessionStorage에서 숫자 값 안전하게 추출
     */
    getNumberFromSession(key: string): number | null {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;

      const num = Number(raw);
      return Number.isFinite(num) ? num : null;
    },
  },
});
