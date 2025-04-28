import { useState } from 'react';
import { updateTask } from '../../services/taskService';
import './TaskList.css';

const TaskList = ({ tasks, setTasks, onUpdateTask, onDeleteTask }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');

  console.log('TaskList props:', { tasks, setTasks: typeof setTasks, onUpdateTask, onDeleteTask }); // Debug

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditTaskName(task.taskName);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditDescription(task.description || '');
    setError('');
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTaskName.trim()) {
      setError('Task name is required');
      return;
    }

    try {
      console.log('Saving task:', { taskId, taskName: editTaskName, dueDate: editDueDate, description: editDescription });
      const updatedTask = await updateTask(taskId, {
        taskName: editTaskName,
        dueDate: editDueDate || null,
        description: editDescription,
        completionStatus: tasks.find((t) => t._id === taskId).completionStatus,
      });
      console.log('API response:', updatedTask);
      if (!updatedTask._id) {
        throw new Error('Invalid task response');
      }
      if (typeof setTasks === 'function') {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskId ? { ...t, ...updatedTask } : t))
        );
      } else {
        console.warn('setTasks is not a function, skipping state update');
      }
      setEditingTaskId(null);
      setEditTaskName('');
      setEditDueDate('');
      setEditDescription('');
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task';
      console.error('Error details:', err, err.stack);
      setError(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTaskName('');
    setEditDueDate('');
    setEditDescription('');
    setError('');
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-heading">Tasks</h2>
      {error && <p className="error">{error}</p>}
      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="empty-state">No tasks available</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task._id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ' && editingTaskId !== task._id) {
                  onUpdateTask(task._id, {
                    completionStatus: task.completionStatus !== 'complete' ? 'complete' : 'incomplete',
                  });
                  e.preventDefault();
                }
              }}
            >
              {editingTaskId === task._id ? (
                <div className="edit-task-form">
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    placeholder="Enter task name"
                    aria-label="Edit task name"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    aria-label="Edit due date"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter task description"
                    aria-label="Edit task description"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="save-btn"
                      aria-label="Save task changes"
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
                  <span className={`task-name ${task.completionStatus === 'complete' ? 'completed' : ''}`}>
                    {task.taskName}
                  </span>
                  <span className="task-due-date">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </span>
                  {task.description && (
                    <span className="task-description">{task.description}</span>
                  )}
                  <span className="task-status">Status: {task.completionStatus}</span>
                  <button
                    className="toggle-btn"
                    onClick={() => onUpdateTask(task._id, {
                      completionStatus: task.completionStatus !== 'complete' ? 'complete' : 'incomplete',
                    })}
                    aria-label={task.completionStatus === 'complete' ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {task.completionStatus === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(task)}
                    aria-label={`Edit task ${task.taskName}`}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteTask(task._id)}
                    aria-label={`Delete task ${task.taskName}`}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;
