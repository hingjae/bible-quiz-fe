import apiClient from "./axios";

export interface Topic {
  id: number;
  title: string;
  bookTitle: string;
}

export const fetchTopics = async () => {
  try {
    const response = await apiClient.get("/api/topics");

    return response.data.data.topics;
  } catch (error) {
    throw error;
  }
};
