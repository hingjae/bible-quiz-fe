import axios from "axios";

export interface Topic {
  id: number;
  title: string;
}

export const fetchTopics = async () => {
  try {
    const response = await axios.get("/api/topics");

    return response.data.data.topics;
  } catch (error) {
    throw error;
  }
};
