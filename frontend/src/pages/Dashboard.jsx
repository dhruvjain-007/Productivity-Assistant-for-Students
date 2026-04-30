import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { analyticsService } from '../services/api';
import { formatDuration } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Focus, CheckCircle, Zap } from 'lucide-react';

const Dashboard = () => {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashData = await analyticsService.getDashboard();
        const insightData = await analyticsService.getInsights();

        setDashboard(dashData);
        setInsights(insightData);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-300">No data available</div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-lg p-6 border-l-4 ${color} hover:shadow-card-lg dark:hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle}
          label="Completed Today"
          value={dashboard.today.completedTasks}
          color="border-blue-500"
        />
        <StatCard
          icon={Focus}
          label="Focus Time Today"
          value={formatDuration(dashboard.today.focusTimeMinutes)}
          color="border-indigo-500"
        />
        <StatCard
          icon={Zap}
          label="This Week"
          value={`${dashboard.week.completedTasks} tasks`}
          color="border-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Current Streak"
          value={`${dashboard.stats.currentStreakDays} days`}
          color="border-orange-500"
        />
      </div>

      {/* Weekly Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-lg p-6 hover:shadow-card-lg dark:hover:shadow-xl transition-shadow\">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4\">Weekly Focus Time</h2>
        {dashboard.weeklyData && dashboard.weeklyData.length > 0 ? (
          <ResponsiveContainer width=\"100%\" height={300}>
            <BarChart data={dashboard.weeklyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray=\"3 3\" stroke=\"#374151\" />
              <XAxis dataKey=\"day\" stroke=\"#6b7280\" />
              <YAxis stroke=\"#6b7280\" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  color: '#f3f4f6'
                }} 
              />
              <Bar dataKey=\"focusTime\" fill=\"#6366f1\" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className=\"h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded\">
            <p className=\"text-gray-500 dark:text-gray-400 text-center\">
              No focus data yet. Start a focus session to see your weekly stats!
            </p>
          </div>
        )}
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-lg shadow-card dark:shadow-lg p-6 hover:shadow-card-lg dark:hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Productivity Insights</h2>
          <div className="space-y-3">
            {insights.recommendations?.map((rec, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded p-3 border-l-4 border-indigo-500">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
