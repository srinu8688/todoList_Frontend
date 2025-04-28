import { useState } from 'react';
import "./AddGroupForm.css";

const AddGroupForm = ({ onAddGroup }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupData.name.trim()) {
      onAddGroup(groupData);
      setGroupData({ name: '', description: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <div className="form-group">
        <label htmlFor="group-name">Group Name</label>
        <input
          type="text"
          id="group-name"
          name="name"
          placeholder="Enter group name"
          value={groupData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="group-description">Description</label>
        <textarea
          id="group-description"
          name="description"
          placeholder="Enter group description (optional)"
          value={groupData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <button type="submit" className="submit-btn">
        Create Group
      </button>
    </form>
  );
};

export default AddGroupForm;