import axios from 'axios';
import { Room } from '../types/room';



const API_URL = 'https://api-hotel-room-booking-git-main-radhakrishnan-gopals-projects.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get(`${API_URL}/rooms`);
  return response.data;
};

export const getRoom = async (id: string): Promise<Room> => {
  const response = await api.get(`${API_URL}/rooms/${id}`);
  return response.data;
};

export const createBooking = async (bookingData: {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}): Promise<any> => {
  try {
    const response = await api.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating booking:', error);
    if (error instanceof Error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};


export const register = async (userData: { email: string; password: string; name: string }): Promise<any> => {
  const response = await api.post(`${API_URL}/users/register`, userData);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const login = async (credentials: { email: string; password: string }): Promise<any> => {
  const response = await api.post(`${API_URL}/users/login`, credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const getUserBookings = async (): Promise<any[]> => {
  const response = await api.get('/bookings');
  return response.data;
};

export const checkRoomAvailability = async (roomId: string, startDate: string, endDate: string): Promise<boolean> => {
  const formattedStartDate = new Date(startDate).toISOString();
  const formattedEndDate = new Date(endDate).toISOString();
  const response = await api.get(`/rooms/${roomId}/availability`, {
    params: { checkInDate: formattedStartDate, checkOutDate: formattedEndDate }
  });
  return response.data.available;
};

export const getNotifications = async (userId: string) => {
  console.log('Fetching notifications for user:', userId);
  const response = await axios.get(`${API_URL}/notifications/${userId}`);
  return response.data;
};

export const sendNotification = async (userId: string, message: string, type: string) => {
  const response = await axios.post(`${API_URL}/notifications`, { userId, message, type });
  return response.data;
};



export const saveToFavorites = async (userId: string, roomId: string) => {
  const response = await axios.post(`${API_URL}/users/${userId}/favorites`, { roomId });
  return response.data;
};
