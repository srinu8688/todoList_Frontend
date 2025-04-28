import api from "../api/axios";

export const createGroup = async (groupData) => {
  console.log('Creating group with data:', groupData);
  const response = await api.post('/groups', groupData);
  console.log('Create group response:', response.data);
  return response.data; // Backend returns group object directly
};

export const getGroups = async () => {
  console.log('Fetching groups');
  const response = await api.get('/groups');
  console.log('Get groups response:', response.data);
  return response.data; // Array of groups
};

export const updateGroup = async (groupId, data) => {
  console.log('Updating group:', { groupId, data });
  const response = await api.put(`/groups/${groupId}`, data);
  console.log('Update group response:', response.data);
  return response.data.group; // Backend returns { message, group }
};

export const deleteGroup = async (groupId) => {
  console.log('Deleting group:', groupId);
  const response = await api.delete(`/groups/${groupId}`);
  console.log('Delete group response:', response.data);
  return response.data;
};