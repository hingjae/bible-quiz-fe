import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosResponse,
} from "axios";

/**
 * API 응답 타입 정의
 */
interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: number;
}

/**
 * 토큰 갱신 응답 타입
 */
interface TokenRefreshResponse {
  token: string;
}

/**
 * 재시도 플래그가 추가된 axios config 타입
 */
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

/**
 * API 설정 상수
 */
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 10000, // 10초
  WITH_CREDENTIALS: true,
} as const;

/**
 * 엔드포인트 상수
 */
const ENDPOINTS = {
  TOKEN_REFRESH: "/api/auth/token",
  LOGOUT: "/api/auth/logout",
} as const;

/**
 * 쿠키 이름 상수
 */
const COOKIE_NAMES = {
  REFRESH_TOKEN_PRESENCE: "rtp",
} as const;

/**
 * 스토리지 키 상수
 */
const STORAGE_KEYS = {
  REDIRECT_PATH: "redirect_path",
} as const;

/**
 * 메인 API 클라이언트 생성
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

/**
 * 리프레시 전용 API 클라이언트 (인터셉터 없음)
 */
const refreshClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

/**
 * 특정 쿠키가 존재하는지 확인
 * @param name - 쿠키 이름
 */
const hasCookie = (name: string): boolean => {
  return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${name}=`));
};

/**
 * RefreshToken 쿠키 존재 여부 확인
 * HttpOnly 쿠키는 JS로 접근 불가하므로 표시용 쿠키(rtp)로 확인
 */
const hasRefreshToken = (): boolean => {
  return hasCookie(COOKIE_NAMES.REFRESH_TOKEN_PRESENCE);
};

/**
 * 현재 경로를 sessionStorage에 저장
 */
const saveRedirectPath = (): void => {
  const currentPath = router.currentRoute.value.fullPath;
  sessionStorage.setItem(STORAGE_KEYS.REDIRECT_PATH, currentPath);
};

/**
 * 로그인 페이지로 리다이렉트
 */
const redirectToLogin = async (): Promise<void> => {
  saveRedirectPath();
  await router.push({ name: "login" });
};

/**
 * 토큰 갱신 Promise 캐싱 (동시 호출 방지)
 */
let refreshPromise: Promise<string> | null = null;

/**
 * AccessToken 갱신
 * 동시에 여러 번 호출되어도 실제 API 요청은 1번만 수행
 * @returns 새로운 accessToken
 * @throws refreshToken이 없거나 갱신 실패 시 에러
 */
export const refreshAccessTokenOnce = async (): Promise<string> => {
  // 이미 진행 중인 갱신 요청이 있으면 재사용
  if (refreshPromise) {
    return refreshPromise;
  }

  // refreshToken 쿠키가 없으면 로그인 필요
  if (!hasRefreshToken()) {
    console.warn("No refreshToken cookie found");
    await redirectToLogin();
    return Promise.reject(new Error("No refreshToken present"));
  }

  const authStore = useAuthStore();

  refreshPromise = refreshClient
    .post<ApiResponse<TokenRefreshResponse>>(ENDPOINTS.TOKEN_REFRESH)
    .then((response: AxiosResponse<ApiResponse<TokenRefreshResponse>>) => {
      const token = response.data?.data?.token;

      if (!token || typeof token !== "string" || token.trim() === "") {
        throw new Error("Invalid accessToken in response");
      }

      authStore.setAccessToken(token);
      return token;
    })
    .catch((error: unknown) => {
      console.error("Token refresh failed:", error);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/**
 * 요청 인터셉터: Authorization 헤더에 accessToken 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    // accessToken이 유효하면 헤더에 추가
    if (token && token.trim() !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

/**
 * 401 에러인지 확인
 */
const isUnauthorizedError = (error: AxiosError): boolean => {
  return error.response?.status === 401;
};

/**
 * 재시도 가능한 요청인지 확인
 */
const isRetryableRequest = (config: RetryableAxiosRequestConfig): boolean => {
  return !config._isRetry;
};

/**
 * 요청에 새 토큰을 부착하고 재시도
 */
const retryRequestWithNewToken = async (
  config: RetryableAxiosRequestConfig,
  newToken: string,
): Promise<AxiosResponse> => {
  config._isRetry = true;
  config.headers.Authorization = `Bearer ${newToken}`;
  return apiClient(config as AxiosRequestConfig);
};

/**
 * 응답 인터셉터: 401 에러 시 토큰 갱신 후 재시도
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
    const config = error.config as RetryableAxiosRequestConfig | undefined;

    // config가 없거나 401 에러가 아니면 그대로 reject
    if (!config || !isUnauthorizedError(error)) {
      return Promise.reject(error);
    }

    // 이미 재시도한 요청이면 더 이상 시도하지 않음
    if (!isRetryableRequest(config)) {
      return Promise.reject(error);
    }

    try {
      // 토큰 갱신 시도
      const newToken = await refreshAccessTokenOnce();

      // 새 토큰으로 원래 요청 재시도
      return await retryRequestWithNewToken(config, newToken);
    } catch (refreshError) {
      // 토큰 갱신 실패 시 로그아웃 처리
      const authStore = useAuthStore();
      authStore.clear();

      console.error("Token refresh failed, clearing auth state:", refreshError);

      // 에러는 그대로 전파 (컴포넌트에서 처리)
      return Promise.reject(error);
    }
  },
);

export default apiClient;

// 추가로 export할 유틸리티들
export { hasRefreshToken, redirectToLogin, ENDPOINTS };
