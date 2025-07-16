import axiosInstance from './axiosInstance';

export async function login(username, password) {
  const response = await axiosInstance.post('users/login', { username, password });
  return response.data; // usually token/user object
}