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
      <n-gradient-text type="info">Login</n-gradient-text>
    </n-h1>

    <!-- 소개 문구 -->
    <n-space vertical align="center" :size="12">
      <n-text strong style="font-size: 1.05rem"> 소셜 계정으로 간편하게 로그인하세요 </n-text>

      <n-text depth="3" style="font-size: 0.95rem"> 구글 또는 카카오 계정을 선택해주세요 </n-text>
    </n-space>

    <!-- 로그인 버튼들 -->
    <n-space vertical :size="16">
      <!-- 구글 로그인 -->
      <n-button
        size="large"
        :loading="loading"
        :disabled="loading"
        @click="loginWith('google')"
        style="width: 280px; height: 48px"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        </template>
        구글 로그인
      </n-button>

      <!-- 카카오 로그인 -->
      <n-button
        color="#FEE500"
        size="large"
        :loading="loading"
        :disabled="loading"
        @click="loginWith('kakao')"
        style="width: 280px; height: 48px; color: #191600"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#000000"
              d="M12 3C6.48 3 2 6.49 2 10.79c0 2.5 1.67 4.7 4.18 6l-.96 3.59a.6.6 0 0 0 .87.69l4-2.38c.63.1 1.28.16 1.91.16 5.52 0 10-3.49 10-7.79C22 6.49 17.52 3 12 3z"
            />
          </svg>
        </template>
        카카오 로그인
      </n-button>
    </n-space>

    <!-- 추가 정보 -->
    <n-text depth="3" style="font-size: 0.85rem; margin-top: 1rem">
      로그인하시면 서비스 이용약관에 동의하게 됩니다
    </n-text>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from "vue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const loading = ref(false);

const loginWith = (provider: "google" | "kakao"): void => {
  if (loading.value) return;
  loading.value = true;

  // Spring Security OAuth2 Client가 자동으로 만들어주는 엔드포인트
  const url = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  window.location.assign(url);
};
</script>
