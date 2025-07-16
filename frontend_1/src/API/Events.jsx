import axiosInstance from './axiosInstance';

export async function createEvent(data) {
  const response = await axiosInstance.post('/events',data);
  return response.data; 
}
export async function getAllEvents(params) {
  const response = await axiosInstance.get('/events',params);
  return response.data; 
}
export async function getEventById(id) {
  const response = await axiosInstance.get(`/events/${id}`);
  return response.data; 
}
export async function updateEvent(id, data) {
  const response = await axiosInstance.put(`/events/${id}`, data); 
  return response.data;
}

export async function deleteEvent(id)
{
    const response = await axiosInstance.delete(`/events/${id}`); 
  return response.data;
}