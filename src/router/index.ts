import { refreshAccessTokenOnce } from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";
import LoginView from "@/views/LoginView.vue";
import QuizView from "@/views/QuizView.vue";
import ResultView from "@/views/ResultView.vue";
import TopicSelectView from "@/views/TopicSelectView.vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "home", component: HomeView, meta: { public: true } },
  { path: "/topics", name: "topics", component: TopicSelectView },
  {
    path: "/quiz",
    name: "quiz",
    component: QuizView,
    props: (route) => ({ topic: route.query.topic }),
  },
  { path: "/result", name: "result", component: ResultView },
  { path: "/login", name: "login", component: LoginView, meta: { public: true } },
  {
    path: "/login/success",
    name: "loginSuccess",
    component: LoginSuccessView,
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 라우팅 전에 인증이 되었는지 체크
router.beforeEach(async (to, _from, next) => {
  const isPublic = !!to.meta.public;
  const auth = useAuthStore();

  if (isPublic) return next();
  if (auth.isAuthenticated) return next();

  try {
    await refreshAccessTokenOnce();
    return next();
  } catch {
    return next({ name: "login" });
  }
});

export default router;
