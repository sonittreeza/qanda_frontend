import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';

const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false); // New state for "New Task" modal
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', completed: false }); // State for new task
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch task list data
  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tasklist/');
        setTaskList(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchTaskList();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasklist/${id}/`);
      setTaskList((prevTaskList) => prevTaskList.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Handle edit
  const handleEdit = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  // Handle close modals
  const handleCloseEditModal = () => {
    setEditTask(null);
    setShowEditModal(false);
  };

  const handleCloseNewTaskModal = () => {
    setNewTask({ title: '', description: '', due_date: '', completed: false });
    setShowNewTaskModal(false);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/tasklist/${editTask.id}/`, editTask);
      setTaskList((prevTaskList) =>
        prevTaskList.map((task) => (task.id === editTask.id ? editTask : task))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Handle new task creation
  const handleSaveNewTask = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/tasklist/', newTask);
      setTaskList((prevTaskList) => [...prevTaskList, response.data]);
      setShowNewTaskModal(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Date formatting
  const formatDate = (dateStr, timeZone) => {
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      timeZone: timeZone,
    }).format(date);

    return formattedDate;
  };

  // Filtered task list
  const filteredTaskList = taskList.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="task-list-container">
      <h2>Q & A List</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button onClick={() => setShowNewTaskModal(true)}>New Question</button> {/* New Task button */}
      <div className="task-table">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Submit Date</th>
              <th>Completed</th>
              <th>Actions   </th>
            </tr>
          </thead>
          <tbody>
            {filteredTaskList.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{formatDate(task.due_date, 'UTC')}</td>
                <td>{task.completed ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Task modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={editTask?.title || ''}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={editTask?.description || ''}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            ></textarea>
            <input
              type="date"
              value={editTask?.due_date || ''}
              onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
            />
            <label>
              Completed:
              <input
                type="checkbox"
                checked={editTask?.completed || false}
                onChange={(e) => setEditTask({ ...editTask, completed: e.target.checked })}
              />
            </label>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCloseEditModal}>Cancel</button>
          </div>
        </div>
      )}
      {/* New Task modal */}
      {showNewTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>New Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            ></textarea>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            />
            <label>
              Completed:
              <input
                type="checkbox"
                checked={newTask.completed}
                onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })}
              />
            </label>
            <button onClick={handleSaveNewTask}>Save</button>
            <button onClick={handleCloseNewTaskModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
