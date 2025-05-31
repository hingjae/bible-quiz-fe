<template>
  <div class="result-container">
    <h1>Bible Quiz - Result</h1>
    <p>
      👏 당신의 점수는 <strong>{{ score }}</strong> / {{ total }} 입니다.
    </p>
    <button class="restart-btn" @click="goHome">처음으로 돌아가기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const score = (window.history.state?.score as number) ?? 0;
const total = (window.history.state?.total as number) ?? 0;

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #f7f0e8, #e8f0f7);
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #4b3f72;
  font-family: "Georgia", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.restart-btn {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  background-color: #6b4eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.restart-btn:hover {
  background-color: #5a3edf;
}
</style>
