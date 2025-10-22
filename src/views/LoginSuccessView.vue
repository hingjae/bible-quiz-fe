// LoginSuccessView.vue
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/api/axios";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

// 로그인 성공 후 AccessToken을 요청 후 redirect
const fetchAccessToken = async () => {
  try {
    const { data } = await apiClient.post("/api/auth/token");

    auth.setAccessToken(data?.data?.token);

    const redirect_path = "redirect_path";

    const redirect = sessionStorage.getItem(redirect_path) || "/";

    sessionStorage.removeItem(redirect_path);

    router.replace(redirect); // 홈 화면이나 원하는 곳으로 이동
  } catch (e) {
    console.error("Failed to refresh token", e);
    router.push("/login");
  }
};

fetchAccessToken();
</script>
