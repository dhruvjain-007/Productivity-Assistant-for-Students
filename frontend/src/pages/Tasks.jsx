import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { taskService, focusService } from '../services/api';
import { formatDuration, priorityColors } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Play, Plus, Trash2 } from 'lucide-react';

const Tasks = () => {
  const { token } = useAuth();
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

  useEffect(() => {
    fetchTasks();
  }, [filter, token, loading]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ status: filter });
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Create Task Form */}
      {showForm && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-lg shadow p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (mins)
              </label>
              <input
                type="number"
                value={newTask.estimatedTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="5"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700"
          >
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
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No tasks found. Create your first task!
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                priorityColors[task.priority]?.border || ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        priorityColors[task.priority]?.bg || ''
                      } ${priorityColors[task.priority]?.text || ''}`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {formatDuration(task.estimatedTime)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() =>
                        startFocusSession(task._id, task.estimatedTime)
                      }
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      title="Start focus session"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateTask(task._id, 'completed')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm font-medium"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
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
