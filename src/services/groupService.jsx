import api from "../api/axios";

export const createGroup = async (name) => {
  const response = await api.post('/groups', { name });
  return response.data.group || response.data; // Handle { message, group } or direct group
};

export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data; // Assumes array of groups
};

export const updateGroup = async (groupId, data) => {
  const response = await api.put(`/groups/${groupId}`, data);
  return response.data.group; // Extract group from { message, group }
};

export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}`);
  return response.data;
};