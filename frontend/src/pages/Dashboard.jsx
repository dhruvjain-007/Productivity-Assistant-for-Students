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
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Focus Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[]} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="focusTime" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      {insights && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Productivity Insights</h2>
          <div className="space-y-3">
            {insights.recommendations?.map((rec, idx) => (
              <div key={idx} className="bg-white rounded p-3 border-l-4 border-indigo-500">
                <p className="text-gray-700 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
