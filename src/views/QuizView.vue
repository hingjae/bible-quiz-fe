<template>
  <n-space
    vertical
    :size="32"
    style="max-width: 800px; margin: 0 auto; padding: 2rem; min-height: 100vh"
  >
    <!-- 제목 -->
    <n-space vertical align="center" :size="12">
      <n-h1 style="margin: 0; font-family: Georgia, serif; text-align: center">
        <n-gradient-text type="info"> Bible Quiz </n-gradient-text>
      </n-h1>
      <n-tag type="info" size="large" round>
        {{ quizStore.topicLabel }}
      </n-tag>
    </n-space>

    <!-- 점수 (제출 후) -->
    <n-statistic v-if="isSubmitted" label="점수" :value="correctCount" style="text-align: center">
      <template #suffix>/ {{ quizzes.length }}</template>
    </n-statistic>

    <!-- 퀴즈 목록 -->
    <n-space vertical :size="24">
      <n-card
        v-for="(quiz, index) in quizzes"
        :key="quiz.id"
        :bordered="false"
        hoverable
        style="border-radius: 12px"
      >
        <!-- 질문 -->
        <n-h3 style="margin: 0 0 1rem 0"> Q{{ index + 1 }}. {{ quiz.question }} </n-h3>

        <!-- 선택지 -->
        <n-space vertical :size="8">
          <n-button
            v-for="(option, optionIndex) in quiz.options"
            :key="option"
            block
            :type="getOptionType(quiz, option)"
            :disabled="isSubmitted"
            :secondary="!isSubmitted && answers[quiz.id] !== option"
            size="large"
            @click="!isSubmitted && selectAnswer(quiz.id, option)"
            style="justify-content: flex-start; text-align: left; height: auto; padding: 1rem"
          >
            <span style="margin-right: 0.5rem; font-weight: bold">
              {{ getOptionLabel(optionIndex) }}
            </span>
            {{ option }}
          </n-button>
        </n-space>

        <!-- 정답 해설 (제출 후) -->
        <n-alert
          v-if="isSubmitted"
          :type="isCorrect(quiz) ? 'success' : 'error'"
          style="margin-top: 1rem"
        >
          <template #header>
            <span v-if="isCorrect(quiz)">
              ✅ 정답입니다! <strong>{{ quiz.correctAnswer }}</strong>
            </span>
            <span v-else>
              ❌ 오답입니다. 정답은
              <strong>
                {{ quiz.correctAnswer }}.
                {{ quiz.options[Number(quiz.correctAnswer) - 1] }}
              </strong>
            </span>
          </template>
          <n-text depth="3">💡 {{ quiz.correctAnswerReason }}</n-text>
        </n-alert>
      </n-card>
    </n-space>

    <!-- 채점하기 버튼 -->
    <n-button
      v-if="!isSubmitted && quizzes.length > 0"
      type="primary"
      size="large"
      block
      strong
      :disabled="Object.keys(answers).length !== quizzes.length"
      @click="submitQuiz"
    >
      <template v-if="Object.keys(answers).length === quizzes.length"> 채점하기 ✅ </template>
      <template v-else>
        모든 문제를 풀어주세요 ({{ Object.keys(answers).length }}/{{ quizzes.length }})
      </template>
    </n-button>

    <!-- 결과 페이지로 가기 버튼 -->
    <n-button v-if="isSubmitted" type="success" size="large" block strong @click="goToResult">
      결과 페이지로 가기 🎉
    </n-button>
  </n-space>
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

const selectAnswer = (quizId: number, option: string): void => {
  if (isSubmitted.value) return;
  answers.value[quizId] = option;
};

const isCorrect = (quiz: Quiz): boolean => {
  return answers.value[quiz.id] === quiz.correctAnswer;
};

const getOptionType = (quiz: Quiz, optionText: string): string => {
  const selected = answers.value[quiz.id];
  const correct = quiz.correctAnswer;

  if (!isSubmitted.value) {
    return selected === optionText ? "primary" : "default";
  } else {
    if (optionText === correct) return "success";
    if (selected === optionText) return "error";
    return "default";
  }
};

const submitQuiz = (): void => {
  correctCount.value = 0;
  quizzes.value.forEach((q) => {
    if (answers.value[q.id] === q.correctAnswer) {
      correctCount.value++;
    }
  });
  isSubmitted.value = true;
};

const goToResult = (): void => {
  router.push({
    name: "result",
    state: {
      score: correctCount.value,
      total: quizzes.value.length,
    },
  });
};
</script>
