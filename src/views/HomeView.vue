<template>
  <div class="home">
    <h1>Bible Quiz</h1>
    <p class="intro">✝️ “성경 좀 아는 척? 지금 확인해보자 😏”</p>
    <p class="subtext">매일 다른 주제로 새로운 성경 퀴즈를 만나보세요.</p>
    <button class="cta" @click="startQuiz" aria-label="오늘의 성경 퀴즈 시작하기">
      오늘의 퀴즈 풀기 🎯
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const startQuiz = (): void => {
  router.push("/topics");
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.intro {
  margin-top: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #5a4a88;
}

.subtext {
  font-size: 0.95rem;
  color: #6f6b80;
  margin-bottom: 1.25rem;
}
.cta {
  padding: 0.95rem 2.2rem;
  font-size: 1.1rem;
  background-color: #6b4eff;
  color: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(107, 78, 255, 0.25);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #4b3f72;
  font-family: "Georgia", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

button {
  padding: 1rem 3rem;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  background-color: #6b4eff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.2s;
}

button:hover {
  background-color: #5a3edf;
  transform: scale(1.05);
} /* Footer 스타일 */
.footer {
  position: absolute;
  bottom: 1rem;
  font-size: 0.85rem;
  color: #999;
}

.footer a {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer a:hover {
  color: #6b4eff;
}
</style>
