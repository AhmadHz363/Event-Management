import axiosInstance from './axiosInstance';

export async function getEventCount() {
  const response = await axiosInstance.get('statistics/events/count');
  return response.data; 
}
export async function getEventStatus() {
  const response = await axiosInstance.get('statistics/events/status');
  return response.data; 
}
export async function getEventtrends(fromDate,toDate) {
  const response = await axiosInstance.get('statistics/registrations/trends',{fromDate,toDate});
  return response.data; 
}
export async function getPopularEvents(limit) {
  const response = await axiosInstance.get('statistics/events/popular',{limit});
  return response.data; 
}
