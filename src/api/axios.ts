import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경변수로 관리
  withCredentials: true, // 필요 시 사용
});

export default apiClient;
