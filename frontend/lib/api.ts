import axios from 'axios';

// Ensure this matches your FastAPI URL
const API_URL = 'http://127.0.0.1:8000';

export const sendMessage = async (message: string) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      text: message,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { answer: "Error: Could not connect to the Policy AI." };
  }
};