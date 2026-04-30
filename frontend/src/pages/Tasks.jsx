import React, { useState, useEffect, useCallback } from 'react';
import { taskService, focusService } from '../services/api';
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
        <form onSubmit={handleCreateTask} className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            placeholder="Task title"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description"
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
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
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
            className={`px-4 py-2 rounded-lg ${
              filter === status ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">No tasks yet</div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm">{task.description}</p>

              <div className="flex gap-2 mt-3">
                {/* ✅ USE handleUpdateTask HERE */}
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateTask(task._id, 'completed')}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Mark Done
                  </button>
                )}

                <button
                  onClick={() => startFocusSession(task._id, task.estimatedTime)}
                  className="p-2 text-blue-600"
                >
                  <Play />
                </button>

                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-2 text-red-600"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;