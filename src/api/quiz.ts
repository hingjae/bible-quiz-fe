import apiClient from "./axios";

export interface Quiz {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  correctAnswerReason: string;
  reference: string;
}

export const fetchQuizzes = async (topicId: number): Promise<Quiz[]> => {
  try {
    const response = await apiClient.get("/api/quizzes", {
      params: { topicId },
    });
    return response.data.data.quizzes;
  } catch (error) {
    throw error; // 💡 필요하면 다시 throw 해서 상위에서 처리
  }
};
