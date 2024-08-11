import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const sendNotification = async (userId: string, message: string, type: string) => {
  const response = await axios.post(`${API_URL}/notifications`, { userId, message, type });
  return response.data;
};

export const getNotifications = async (userId: string) => {
  const response = await axios.get(`${API_URL}/notifications/${userId}`);
  return response.data;
};