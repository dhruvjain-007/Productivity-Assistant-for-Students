import React, { useState } from 'react';
import { useAuth } from '../hooks/useContexts';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';
import { Wand2 } from 'lucide-react';

const PlannerGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const data = await taskService.generatePlan({ date: new Date() });
      setPlan(data.plan);
      toast.success('Plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">AI Daily Planner</h1>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow p-8 text-center">
        <Wand2 className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate Your Daily Plan</h2>
        <p className="text-gray-600 mb-6">
          Let AI create a personalized study plan based on your goals and available time
        </p>
        <button
          onClick={generatePlan}
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold transition"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {plan && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Plan</h2>
          <div className="space-y-4">
            {plan.tasks?.map((task, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-indigo-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {task.timeEstimate}m
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {task.priority && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerGenerator;
