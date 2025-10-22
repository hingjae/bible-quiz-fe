<template>
  <div class="home">
    <h1>Login</h1>

    <button class="gsi-material-button" :disabled="loading" @click="loginWith('google')">
      <div class="gsi-material-button-state"></div>
      <div class="gsi-material-button-content-wrapper">
        <div class="gsi-material-button-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
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
        </div>
        <span class="gsi-material-button-contents">구글 로그인</span>
      </div>
    </button>

    <button class="gsi-material-button kakao" :disabled="loading" @click="loginWith('kakao')">
      <div class="gsi-material-button-state"></div>
      <div class="gsi-material-button-content-wrapper">
        <div class="gsi-material-button-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M12 3C6.48 3 2 6.49 2 10.79c0 2.5 1.67 4.7 4.18 6l-.96 3.59a.6.6 0 0 0 .87.69l4-2.38c.63.1 1.28.16 1.91.16 5.52 0 10-3.49 10-7.79C22 6.49 17.52 3 12 3z"
            />
          </svg>
        </div>
        <span class="gsi-material-button-contents">카카오 로그인</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const loading = ref(false);

const loginWith = (provider: "google" | "kakao") => {
  if (loading.value) return;
  loading.value = true;

  // spring security oauth2 client가 자동으로 만들어주는 엔드포인트
  const url = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  window.location.assign(url);
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #4b3f72;
  font-family: "Georgia", serif;
  margin-bottom: 0.5rem;
}

.gsi-material-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #747775;
  border-radius: 4px;
  height: 40px;
  padding: 0 12px;
  font-family: "Roboto", arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
  cursor: pointer;
  background-color: #ffffff;
  transition: box-shadow 0.2s;
  width: 240px;
}

.gsi-material-button:hover {
  box-shadow:
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.gsi-material-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gsi-material-button-content-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.gsi-material-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  margin-right: 12px;
}

.gsi-material-button-contents {
  flex-grow: 1;
  text-align: center;
}

.kakao {
  background-color: #fee500; /* 카카오 노랑 */
  border: none;
  color: #191600;
}

.kakao:hover {
  filter: brightness(0.95);
}
</style>
