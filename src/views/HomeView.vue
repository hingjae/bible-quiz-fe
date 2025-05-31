<template>
  <div class="home">
    <h1>Bible Quiz</h1>
    <button @click="startQuiz">Start Quiz</button>
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

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #4b3f72;
  margin-bottom: 2rem;
  font-family: "Georgia", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

button {
  padding: 1rem 3rem;
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
}
</style>
