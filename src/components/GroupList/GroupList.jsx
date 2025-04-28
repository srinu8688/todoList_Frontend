import { useState } from 'react';
import { updateGroup } from '../../services/groupService';
import './GroupList.css';

const GroupList = ({ groups, setGroups, onSelectGroup, onDeleteGroup, selectedGroupId }) => {
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDescription, setEditGroupDescription] = useState('');
  const [error, setError] = useState('');

  console.log('GroupList props:', { setGroups: typeof setGroups, groups });

  const handleEditClick = (group) => {
    const user = JSON.parse(localStorage.getItem('user')); // Fix: Use 'user' key
    const token = user?.token;
    console.log('Token:', token);
    if (!token) {
      console.warn('No token found, redirecting to login');
      window.location.href = '/login';
      return;
    }
    setEditingGroupId(group._id);
    setEditGroupName(group.name);
    setEditGroupDescription(group.description || '');
    setError('');
  };

  const handleSaveEdit = async (groupId) => {
    if (!editGroupName.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      console.log('Saving:', { groupId, name: editGroupName, description: editGroupDescription });
      const updatedGroup = await updateGroup(groupId, {
        name: editGroupName,
        description: editGroupDescription,
      });
      console.log('API response:', updatedGroup);
      if (!updatedGroup._id) {
        throw new Error('Invalid group response');
      }
      setGroups((prevGroups) => {
        const newGroups = prevGroups.map((g) =>
          g._id === groupId ? { ...g, ...updatedGroup } : g
        );
        console.log('Updated groups:', newGroups);
        return newGroups;
      });
      if (selectedGroupId === groupId) {
        onSelectGroup(updatedGroup);
      }
      setEditingGroupId(null);
      setEditGroupName('');
      setEditGroupDescription('');
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update group';
      console.error('Update group error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(errorMessage);
      if (err.response?.status === 401) {
        console.warn('Unauthorized, redirecting to login');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditGroupName('');
    setEditGroupDescription('');
    setError('');
  };

  return (
    <div className="group-list-container">
      <h2 className="group-list-heading">Your Groups</h2>
      {error && <p className="error">{error}</p>}
      <ul className="group-list">
        {groups.length === 0 ? (
          <li className="empty-state">No groups available</li>
        ) : (
          groups.map((group) => (
            <li
              key={group._id}
              className={selectedGroupId === group._id ? 'selected' : ''}
              onClick={() => onSelectGroup(group)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectGroup(group);
                  e.preventDefault();
                }
              }}
              aria-selected={selectedGroupId === group._id}
            >
              {editingGroupId === group._id ? (
                <div className="edit-group-form">
                  <input
                    type="text"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(group._id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    placeholder="Enter group name"
                    aria-label="Edit group name"
                    autoFocus
                  />
                  <textarea
                    value={editGroupDescription}
                    onChange={(e) => setEditGroupDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        handleSaveEdit(group._id);
                        e.preventDefault();
                      }
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    placeholder="Enter group description"
                    aria-label="Edit group description"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleSaveEdit(group._id)}
                      className="save-btn"
                      aria-label="Save group changes"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                      aria-label="Cancel edit"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="group-info">
                    <span className="group-name">{group.name}</span>
                    {group.description && (
                      <span className="group-description">{group.description}</span>
                    )}
                  </div>
                  <div className="group-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(group);
                      }}
                      className="edit-btn"
                      aria-label={`Edit group ${group.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteGroup(group._id);
                      }}
                      className="delete-btn"
                      aria-label={`Delete group ${group.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GroupList;