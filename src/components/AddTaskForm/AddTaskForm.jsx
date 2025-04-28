import { useState } from 'react';
import './AddTaskForm.css';

const AddTaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [completionStatus, setCompletionStatus] = useState('incomplete');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim() && dueDate) {
      onAddTask(taskName, dueDate, description, completionStatus);
      setTaskName('');
      setDueDate('');
      setDescription('');
      setCompletionStatus('incomplete');
    }
  };

  const isSubmitDisabled = !taskName.trim() || !dueDate;

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <label htmlFor="taskName">Task Name</label>
        <input
          type="text"
          id="taskName"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="form-group">
        <label htmlFor="completionStatus">Status</label>
        <select
          id="completionStatus"
          value={completionStatus}
          onChange={(e) => setCompletionStatus(e.target.value)}
          aria-label="Task completion status"
        >
          <option value="incomplete">Incomplete</option>
          <option value="complete">Complete</option>
          <option value="abandoned">Abandoned</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitDisabled}
        aria-disabled={isSubmitDisabled}
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;