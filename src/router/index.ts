import HomeView from "@/views/HomeView.vue";
import QuizView from "@/views/QuizView.vue";
import ResultView from "@/views/ResultView.vue";
import TopicSelectView from "@/views/TopicSelectView.vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "home", component: HomeView },
  { path: "/topics", name: "topics", component: TopicSelectView },
  {
    path: "/quiz",
    name: "quiz",
    component: QuizView,
    props: (route) => ({ topic: route.query.topic }),
  },
  { path: "/result", name: "result", component: ResultView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
