<template>
  <n-space
    vertical
    :size="40"
    align="center"
    justify="center"
    style="min-height: 100vh; padding: 2rem"
  >
    <!-- 제목 -->
    <n-space vertical align="center" :size="12">
      <n-h1 style="margin: 0; font-family: Georgia, serif">
        <n-gradient-text type="info">Bible Quiz</n-gradient-text>
      </n-h1>
      <n-text depth="3" style="font-size: 1rem"> 원하는 주제를 선택하면 퀴즈가 시작됩니다. </n-text>
    </n-space>

    <!-- 구약 섹션 -->
    <n-space
      v-if="oldTestamentTopics.length"
      vertical
      :size="16"
      style="width: 100%; max-width: 800px"
    >
      <n-h2 style="margin: 0; text-align: center">
        <n-text type="success">📖 구약</n-text>
      </n-h2>
      <n-space justify="center" :size="12" :wrap="true">
        <n-button
          v-for="topic in oldTestamentTopics"
          :key="topic.id"
          type="success"
          size="large"
          round
          strong
          @click="goToQuiz(topic)"
          style="min-width: 150px"
        >
          {{ topic.question || topic.bookTitle }}
        </n-button>
      </n-space>
    </n-space>

    <!-- 신약 섹션 -->
    <n-space
      v-if="newTestamentTopics.length"
      vertical
      :size="16"
      style="width: 100%; max-width: 800px"
    >
      <n-h2 style="margin: 0; text-align: center">
        <n-text type="info">✝️ 신약</n-text>
      </n-h2>
      <n-space justify="center" :size="12" :wrap="true">
        <n-button
          v-for="topic in newTestamentTopics"
          :key="topic.id"
          type="info"
          size="large"
          round
          strong
          @click="goToQuiz(topic)"
          style="min-width: 150px"
        >
          {{ topic.question || topic.bookTitle }}
        </n-button>
      </n-space>
    </n-space>
  </n-space>
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

const goToQuiz = (topic: Topic): void => {
  const label = topic.question || topic.bookTitle;
  quizStore.setTopic(topic.id, label);
  router.push({ name: "quiz" });
};
</script>
