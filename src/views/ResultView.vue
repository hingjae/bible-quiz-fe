<template>
  <n-space
    vertical
    :size="40"
    align="center"
    justify="center"
    style="min-height: 100vh; padding: 2rem"
  >
    <!-- 제목 -->
    <n-h1 style="margin: 0; font-family: Georgia, serif">
      <n-gradient-text type="info">Bible Quiz</n-gradient-text>
    </n-h1>

    <!-- 점수 섹션 -->
    <n-space vertical :size="24" align="center">
      <!-- 축하 메시지 -->
      <n-text strong style="font-size: 1.5rem"> 👏 당신의 점수는 </n-text>

      <!-- 점수 표시 -->
      <n-statistic :value="score">
        <template #suffix>
          <n-text style="font-size: 1.5rem">/ {{ total }}</n-text>
        </template>
      </n-statistic>

      <!-- 성적 뱃지 -->
      <n-tag v-if="percentage >= 80" type="success" size="large" round :bordered="false">
        🎉 훌륭합니다! 성경에 대해 정말 잘 알고 계시네요!
      </n-tag>
      <n-tag v-else-if="percentage >= 60" type="info" size="large" round :bordered="false">
        💪 잘하셨어요! 조금만 더 공부하면 완벽해질 거예요!
      </n-tag>
      <n-tag v-else type="warning" size="large" round :bordered="false">
        📖 아쉽네요! 다시 도전해보세요!
      </n-tag>
    </n-space>

    <!-- 버튼 그룹 -->
    <n-space :size="16">
      <n-button type="primary" size="large" round strong @click="goHome">
        처음으로 돌아가기
      </n-button>
      <!-- 
      <n-button
        type="warning"
        size="large"
        round
        strong
        @click="goRanking"
      >
        랭킹 등록하기
      </n-button>
      -->
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const score = (window.history.state?.score as number) ?? 0;
const total = (window.history.state?.total as number) ?? 0;

const percentage = computed(() => {
  if (total === 0) return 0;
  return (score / total) * 100;
});

const goHome = (): void => {
  router.push("/");
};

// const goRanking = (): void => {
//   router.push({
//     path: "/ranking",
//     state: { score, total },
//   });
// };
</script>
