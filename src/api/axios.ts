import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경변수로 관리
  withCredentials: true, // 쿠키 자동 전송 (교차 도메인일 때 필수)
});

// 요청할 때 헤더에 토큰을 포함.
apiClient.interceptors.request.use((config) => {
  const auth = useAuthStore();
  const token = auth.accessToken;

  // accessToken이 있으면 header에 넣음.
  if (typeof token === "string" && token.trim() !== "") {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── 리프레시 전용 클라이언트 (인터셉터 최소화)
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ── HttpOnly가 아닌 표시용 쿠키로 refreshToken 존재 여부 확인 (refreshToken은 HttpOnly이기 때문에 js로 접근할 수 없음.)
const hasRefreshPresenceCookie = () =>
  document.cookie.split("; ").some((c) => c.startsWith("rtp="));

// ── 리프레시 메서드 (Promise 캐싱으로 동시 호출 1회화)
let refreshPromise: Promise<string> | null = null;

// AccessToken 발급 메서드
export async function refreshAccessTokenOnce(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  // refreshToken이 없으면 로그인 페이지로 이동
  if (!hasRefreshPresenceCookie()) {
    console.warn("No refreshToken cookie found → redirecting to login");
    const redirectPath = router.currentRoute.value.fullPath;
    sessionStorage.setItem("redirect_path", redirectPath);
    await router.push({ name: "login" });
    return Promise.reject(new Error("No refreshToken present"));
  }

  const auth = useAuthStore();
  refreshPromise = refreshClient
    .post("/api/auth/token") // refreshToken으로 AccessToken 발급
    .then(({ data }) => {
      const token = data?.data?.token as string;
      if (typeof token !== "string" || token.trim() === "") {
        throw new Error("No accessToken in response");
      }
      auth.setAccessToken(token);
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// ── 응답 인터셉터: 401이면 1) 리프레시, 2) 원요청 재시도
apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config } = error || {};
    if (!response || !config) return Promise.reject(error);

    if (response.status === 401 && !config.__isRetry) {
      try {
        const newToken = await refreshAccessTokenOnce();
        // 재시도 시 새 토큰 부착
        config.__isRetry = true;
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(config as AxiosRequestConfig);
      } catch {
        const auth = useAuthStore();
        auth.clear();
        // 여기서 라우팅은 라우터 가드/뷰 컴포넌트에 맡기는 게 보통 더 깔끔
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
