<template>
  <n-space
    vertical
    align="center"
    justify="center"
    :size="40"
    style="min-height: 100vh; padding: 2rem"
  >
    <!-- 제목 -->
    <n-h1 style="margin: 0; font-family: Georgia, serif">
      <n-gradient-text type="info">Bible Quiz</n-gradient-text>
    </n-h1>

    <!-- 소개 문구 -->
    <n-space vertical align="center" :size="12">
      <n-text strong style="font-size: 1.05rem"> ✝️ "성경 좀 아는 척? 지금 확인해보자 😏" </n-text>

      <n-text depth="3" style="font-size: 0.95rem">
        매일 다른 주제로 새로운 성경 퀴즈를 만나보세요.
      </n-text>
    </n-space>

    <!-- CTA 버튼 -->
    <n-button
      type="primary"
      size="large"
      round
      strong
      @click="startQuiz"
      style="font-size: 1.1rem; padding: 0 2.5rem"
    >
      <template #icon>
        <span style="font-size: 1.2rem">🎯</span>
      </template>
      오늘의 퀴즈 풀기
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const startQuiz = (): void => {
  router.push("/topics");
};
</script>
