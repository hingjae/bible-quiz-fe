import apiClient from "./axios";

export interface Topic {
  id: number;
  question: string;
  bookTitle: string;
  testament: "OLD" | "NEW";
}

export const fetchTopics = async (): Promise<Topic[]> => {
  try {
    const response = await apiClient.get("/api/daily-topics");

    return response.data.data.topics;
  } catch (error) {
    throw error;
  }
};
