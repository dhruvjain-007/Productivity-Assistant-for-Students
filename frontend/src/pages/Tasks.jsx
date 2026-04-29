import React, { useState, useEffect, useCallback } from 'react';
import { taskService, focusService } from '../services/api';
import { formatDuration, priorityColors } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Play, Plus, Trash2 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedTime: 30,
    category: 'studying',
  });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ status: filter });
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(newTask);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        estimatedTime: 30,
        category: 'studying',
      });
      setShowForm(false);
      fetchTasks();
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, status) => {
    try {
      await taskService.updateTask(taskId, { status });
      fetchTasks();
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const startFocusSession = async (taskId, estimatedTime) => {
    try {
      await focusService.startSession({
        taskId,
        plannedDuration: estimatedTime,
      });
      toast.success('Focus session started');
    } catch (error) {
      toast.error('Failed to start focus session');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTask} className="bg-white rounded-lg shadow p-6 space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            placeholder="Task title"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="number"
              value={newTask.estimatedTime}
              onChange={(e) =>
                setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })
              }
              min="5"
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Create Task
          </button>
        </form>
      )}

      <div className="flex gap-2">
        {['pending', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center">No tasks</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span>{formatDuration(task.estimatedTime)}</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startFocusSession(task._id, task.estimatedTime)}>
                <Play />
              </button>
              <button onClick={() => handleDeleteTask(task._id)}>
                <Trash2 />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;