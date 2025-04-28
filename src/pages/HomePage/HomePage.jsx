import { useState, useEffect } from 'react';
import { getGroups, createGroup, deleteGroup } from '../../services/groupService';
import { createTask, getTasks, updateTask, deleteTask } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';
import GroupList from '../../components/GroupList/GroupList';
import AddGroupForm from '../../components/AddGroupForm/AddGroupForm';
import TaskList from '../../components/TaskList/TaskList';
import AddTaskForm from '../../components/AddTaskForm/AddTaskForm';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  useEffect(() => {
    if (selectedGroup) {
      fetchTasks(selectedGroup._id);
    } else {
      setTasks([]);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const data = await getGroups();
      console.log('Fetched groups:', data);
      setGroups(data);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      if (err.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    }
  };

  const fetchTasks = async (groupId) => {
    try {
      const data = await getTasks(groupId);
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    }
  };

  const handleAddGroup = async (groupData) => {
    try {
      const newGroup = await createGroup(groupData);
      setGroups([...groups, newGroup]);
      return newGroup;
    } catch (error) {
      console.error('Failed to create group:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      } else {
        alert(error.response?.data?.message || 'Failed to create group');
      }
      throw error;
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setGroups(groups.filter((g) => g._id !== groupId));
      if (selectedGroup?._id === groupId) {
        setSelectedGroup(null);
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    }
  };

  const handleAddTask = async (taskName, dueDate, description, completionStatus) => {
    try {
      console.log('Adding task with:', { taskName, dueDate, description, completionStatus, groupId: selectedGroup._id });
      const taskData = { taskName, dueDate, description, completionStatus };
      const newTask = await createTask(selectedGroup._id, taskData);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Failed to add task:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      } else {
        alert(error.response?.data?.message || 'Failed to add task. Please try again.');
      }
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error('Failed to update task:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      } else {
        alert(error.response?.data?.message || 'Failed to update task.');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
      }
    }
  };

  console.log('HomePage: setTasks type:', typeof setTasks);

  return (
    <div className="homepage-container">
      <header className="app-header">
        <h1>TodoList App</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="content-wrapper">
        <div className="sidebar">
          <AddGroupForm onAddGroup={handleAddGroup} />
          {groups.length === 0 ? (
            <div className="empty-state">
              <p>No groups created yet</p>
            </div>
          ) : (
            <GroupList
              groups={groups}
              setGroups={setGroups}
              onSelectGroup={setSelectedGroup}
              onDeleteGroup={handleDeleteGroup}
              selectedGroupId={selectedGroup?._id}
            />
          )}
        </div>

        <div className="main-content">
          {selectedGroup ? (
            <>
              <div className="group-header">
                <h2>{selectedGroup.name}</h2>
                {selectedGroup.description && (
                  <p className="group-description">{selectedGroup.description}</p>
                )}
              </div>
              <AddTaskForm onAddTask={handleAddTask} />
              <TaskList
                tasks={tasks}
                setTasks={setTasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </>
          ) : (
            <div className="empty-state">
              <p>Select a group to view or add tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;