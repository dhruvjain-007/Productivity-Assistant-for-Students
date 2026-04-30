import React, { useState } from 'react';
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
      if (data && data.plan) {
        setPlan(data.plan);
        toast.success('Plan generated successfully!');
      } else {
        toast.error('No plan generated. Please try again.');
      }
    } catch (error) {
      console.error('Plan generation error:', error);
      toast.error(error.message || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI Daily Planner</h1>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-lg shadow-card dark:shadow-lg p-8 text-center hover:shadow-card-lg dark:hover:shadow-xl transition-shadow">
        <Wand2 className="w-16 h-16 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Generate Your Daily Plan</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Let AI create a personalized study plan based on your goals and available time
        </p>
        <button
          onClick={generatePlan}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-8 py-3 rounded-lg disabled:opacity-50 font-semibold transition-all shadow-md"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {plan && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-lg p-6 hover:shadow-card-lg dark:hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Today's Plan</h2>
          <div className="space-y-4">
            {plan.tasks?.map((task, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border-l-4 border-indigo-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium">
                      {task.timeEstimate}m
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {task.priority && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
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
