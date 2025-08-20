<template>
  <div class="quiz-container">
    <h1>Bible Quiz - {{ quizStore.topicLabel }}</h1>

    <div v-for="(quiz, index) in quizzes" :key="quiz.id" class="quiz-block">
      <h2>Q{{ index + 1 }}. {{ quiz.question }}</h2>
      <ul>
        <li
          v-for="(option, optionIndex) in quiz.options"
          :key="option"
          :class="getOptionClass(quiz, option)"
          @click="!isSubmitted && selectAnswer(quiz.id, option)"
        >
          <span class="option-number">{{ getOptionLabel(optionIndex) }}</span>
          {{ option }}
        </li>
      </ul>
      <div v-if="isSubmitted" class="answer-comment">
        <span v-if="isCorrect(quiz)"
          >✅ 정답입니다! <strong>{{ quiz.correctAnswer }}</strong></span
        >
        <span v-else
          >❌ 오답입니다. 정답은
          <strong
            >{{ quiz.correctAnswer }}.{{ quiz.options[Number(quiz.correctAnswer) - 1] }}</strong
          >
        </span>

        <div class="reason">💡 정답 해설: {{ quiz.correctAnswerReason }}</div>
      </div>
    </div>

    <button v-if="!isSubmitted && quizzes.length > 0" class="submit-btn" @click="submitQuiz">
      채점하기
    </button>

    <button v-if="isSubmitted" class="result-btn" @click="goToResult">결과 페이지로 가기</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchQuizzes, type Quiz } from "@/api/quiz";
import { useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quiz";

const quizzes = ref<Quiz[]>([]);
const answers = ref<{ [key: number]: string }>({});
const isSubmitted = ref(false);
const correctCount = ref(0);

const router = useRouter();
const quizStore = useQuizStore();

onMounted(async () => {
  quizStore.hydrateFromSession();

  if (quizStore.topicId == null) {
    router.replace({ name: "topics" });
    return;
  }

  try {
    const fetchedQuizzes = await fetchQuizzes(quizStore.topicId);
    quizzes.value = fetchedQuizzes.map((quiz) => ({
      ...quiz,
      options: quiz.options
        .map((option) => ({ value: option, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    }));
  } catch (error) {
    console.error(error);
  }
});

const getOptionLabel = (index: number): string => {
  return `${index + 1}.`;
};

const selectAnswer = (quizId: number, option: string) => {
  if (isSubmitted.value) return;
  answers.value[quizId] = option;
};

const isCorrect = (quiz: Quiz) => {
  return answers.value[quiz.id] === quiz.correctAnswer;
};

const getOptionClass = (quiz: Quiz, optionText: string) => {
  const selected = answers.value[quiz.id];
  const correct = quiz.correctAnswer;

  if (!isSubmitted.value) {
    return selected === optionText ? "selected" : "";
  } else {
    if (optionText === correct) return "correct";
    if (selected === optionText) return "wrong";
    return "";
  }
};

const submitQuiz = () => {
  correctCount.value = 0;
  quizzes.value.forEach((q) => {
    if (answers.value[q.id] === q.correctAnswer) {
      correctCount.value++;
    }
  });
  isSubmitted.value = true;
};

const goToResult = () => {
  router.push({
    name: "result",
    state: {
      score: correctCount.value,
      total: quizzes.value.length,
    },
  });
};
</script>

<style scoped>
h1 {
  font-size: 2.8rem;
  font-weight: bold;
  color: #3b2f78;
  margin-bottom: 2rem;
  font-family: "Georgia", serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-block {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.quiz-block h2 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #222;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

li:hover {
  background-color: #e0e7ff;
}

li.selected {
  background-color: #6b4eff;
  color: white;
}
li.selected .option-number {
  color: white;
}

li.correct {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}
li.correct .option-number {
  color: white;
}

li.wrong {
  background-color: #f44336;
  color: white;
  font-weight: bold;
}
li.wrong .option-number {
  color: white;
}

.option-number {
  margin-right: 0.5rem;
  font-weight: bold;
  color: #333;
}

.submit-btn {
  display: block;
  margin: 2rem auto;
  padding: 0.6rem 2rem;
  font-size: 1rem;
  background-color: #6b4eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #5a3edf;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.answer-comment {
  margin-top: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: #333;
  border-top: 1px solid #e0e0e0;
}

.reference {
  margin-top: 5px;
  font-size: 0.85rem;
  color: #555;
  font-style: italic;
}

.result-btn {
  display: block;
  margin: 2rem auto;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.result-btn:hover {
  background-color: #43a047;
}

.reason {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #444;
  background-color: #f9f9f9;
  padding: 0.5rem 0.75rem;
  border-left: 4px solid #6b4eff;
  border-radius: 4px;
}
</style>
