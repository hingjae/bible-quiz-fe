import { refreshAccessTokenOnce } from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";
import LoginView from "@/views/LoginView.vue";
import QuizView from "@/views/QuizView.vue";
import ResultView from "@/views/ResultView.vue";
import TopicSelectView from "@/views/TopicSelectView.vue";
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";

/**
 * 라우트 메타 타입 정의
 */
interface RouteMeta {
  public?: boolean;
  title?: string;
}

/**
 * 라우트 이름 상수
 */
const ROUTE_NAMES = {
  HOME: "home",
  TOPICS: "topics",
  QUIZ: "quiz",
  RESULT: "result",
  LOGIN: "login",
  LOGIN_SUCCESS: "loginSuccess",
} as const;

/**
 * 라우트 경로 상수
 */
const ROUTE_PATHS = {
  HOME: "/",
  TOPICS: "/topics",
  QUIZ: "/quiz",
  RESULT: "/result",
  LOGIN: "/login",
  LOGIN_SUCCESS: "/login/success",
} as const;

/**
 * 애플리케이션 라우트 정의
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: ROUTE_PATHS.HOME,
    name: ROUTE_NAMES.HOME,
    component: HomeView,
    meta: { public: true, title: "홈" } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.TOPICS,
    name: ROUTE_NAMES.TOPICS,
    component: TopicSelectView,
    meta: { title: "주제 선택" } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.QUIZ,
    name: ROUTE_NAMES.QUIZ,
    component: QuizView,
    props: (route) => ({ topic: route.query.topic }),
    meta: { title: "퀴즈" } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.RESULT,
    name: ROUTE_NAMES.RESULT,
    component: ResultView,
    meta: { title: "결과" } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: LoginView,
    meta: { public: true, title: "로그인" } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.LOGIN_SUCCESS,
    name: ROUTE_NAMES.LOGIN_SUCCESS,
    component: LoginSuccessView,
    meta: { public: true, title: "로그인 성공" } satisfies RouteMeta,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * 라우트가 공개 페이지인지 확인
 */
const isPublicRoute = (route: RouteLocationNormalized): boolean => route.meta.public === true;

/**
 * 인증 확인 및 토큰 갱신 시도
 */
const ensureAuthenticated = async (): Promise<boolean> => {
  const autheStore = useAuthStore();

  if (autheStore.isAuthenticated) {
    return true;
  }

  try {
    await refreshAccessTokenOnce();
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

// 인증 가드
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ): Promise<void> => {
    if (isPublicRoute(to)) {
      return next();
    }

    const isAuthenticated = await ensureAuthenticated();

    if (isAuthenticated) {
      return next();
    }

    return next({
      name: ROUTE_NAMES.LOGIN,
      query: { redirect: to.fullPath },
    });
  },
);

/**
 * 페이지 타이틀 설정
 */
router.afterEach((to: RouteLocationNormalized): void => {
  const title = (to.meta.title as string) ?? "Quiz App";
  document.title = title;
});

export default router;
export { ROUTE_NAMES, ROUTE_PATHS };
