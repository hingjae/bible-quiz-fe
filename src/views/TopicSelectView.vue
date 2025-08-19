<template>
  <div class="topic-container">
    <h1>Bible Quiz</h1>
    <p class="description">원하는 주제를 선택하면 퀴즈가 시작됩니다.</p>

    <section v-if="oldTestamentTopics.length">
      <h2 class="section-title">📖 구약</h2>
      <div class="topic-grid">
        <button
          v-for="topic in oldTestamentTopics"
          :key="topic.id"
          class="topic-btn old"
          @click="goToQuiz(topic.id)"
        >
          {{ topic.question || topic.bookTitle }}
        </button>
      </div>
    </section>

    <section v-if="newTestamentTopics.length">
      <h2 class="section-title">✝️ 신약</h2>
      <div class="topic-grid">
        <button
          v-for="topic in newTestamentTopics"
          :key="topic.id"
          class="topic-btn new"
          @click="goToQuiz(topic.id)"
        >
          {{ topic.question || topic.bookTitle }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fetchTopics, type Topic } from "@/api/topic";
import { useQuizStore } from "@/stores/quiz";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const quizStore = useQuizStore();
const topics = ref<Topic[]>([]);

onMounted(async () => {
  try {
    topics.value = await fetchTopics();
  } catch (error) {
    console.error(error);
  }
});

const oldTestamentTopics = computed(() => topics.value.filter((t) => t.testament === "OLD"));
const newTestamentTopics = computed(() => topics.value.filter((t) => t.testament === "NEW"));

const goToQuiz = (topicId: number) => {
  quizStore.setTopic(topicId);
  router.push({ name: "quiz" });
};
</script>

<style scoped>
.topic-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  /* 중앙 정렬 추가 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 중앙 */
  align-items: center; /* 가로 중앙 */
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b2f78;
  margin-bottom: 1rem;
  font-family: "Georgia", serif;
}

.description {
  font-size: 1rem;
  color: #555;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4b3f72;
  margin: 1.5rem 0 1rem;
}

.topic-grid {
  display: flex; /* flex 레이아웃 */
  justify-content: center; /* 가로 중앙 정렬 */
  gap: 1rem; /* 버튼 간격 */
  flex-wrap: wrap; /* 화면이 좁아지면 자동 줄바꿈 */
  margin-bottom: 2rem;
}

.topic-btn {
  background-color: #6b4eff;
  color: white;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.topic-btn:hover {
  background-color: #5a3edf;
}

.topic-btn.old {
  background-color: #2d9d78; /* 초록 계열 (구약) */
}
.topic-btn.old:hover {
  background-color: #238067;
}

.topic-btn.new {
  background-color: #6b4eff; /* 보라 계열 (신약) */
}
.topic-btn.new:hover {
  background-color: #5a3edf;
}
</style>
