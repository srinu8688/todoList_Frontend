import api from "../api/axios";

export const createTask = async (groupId, taskData) => {
  const response = await api.post(`/tasks/group/${groupId}`, taskData);
  return response.data;
};

export const getTasks = async (groupId) => {
  const response = await api.get(`/tasks/${groupId}`);
  return response.data;
};

export const updateTask = async (taskId, data) => {
  console.log('Updating task:', { taskId, data });
  const response = await api.put(`/tasks/${taskId}`, data);
  console.log('Task update response:', response.data);
  return response.data.task;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};