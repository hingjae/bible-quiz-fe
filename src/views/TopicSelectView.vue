<template>
  <div class="topic-container">
    <h1>Bible Quest - 주제 선택</h1>
    <p class="description">원하는 주제를 선택하면 퀴즈가 시작됩니다.</p>

    <div class="topic-grid">
      <button v-for="topic in topics" :key="topic.id" class="topic-btn" @click="goToQuiz(topic.id)">
        {{ topic.title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchTopics, type Topic } from "@/api/topic";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const topics = ref<Topic[]>([]);

onMounted(async () => {
  try {
    topics.value = await fetchTopics();
  } catch (error) {
    throw error;
  }
});

const goToQuiz = (topicId: number) => {
  router.push({ name: "quiz", query: { topicId } });
};
</script>

<style scoped>
.topic-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
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
  margin-bottom: 2rem;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
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
</style>
