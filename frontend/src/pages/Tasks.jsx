import React, { useState, useEffect, useCallback } from 'react';
import { taskService, focusService } from '../services/api';
import { formatDuration } from '../utils/helpers';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-lg p-6 space-y-4 hover:shadow-card-lg dark:hover:shadow-xl transition-shadow"
        >
          <input
            type="text"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
            required
            placeholder="Task title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Describe what you need to do (optional)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Level</label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Time (minutes)</label>
              <input
                type="number"
                value={newTask.estimatedTime}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    estimatedTime: parseInt(e.target.value),
                  })
                }
                min="5"
                placeholder="e.g., 30"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2 rounded-lg transition-all shadow-md font-medium">
            Create Task
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {['pending', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-all capitalize font-medium shadow-sm ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8\">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-card">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-card-lg dark:hover:shadow-xl p-4 transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{task.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{task.description}</p>
                  <div className="flex gap-2 mt-3 items-center flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Est. {task.estimatedTime}m</span>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      task.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      task.status === 'in-progress' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {task.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startFocusSession(task._id, task.estimatedTime)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                    title="Start focus session"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;