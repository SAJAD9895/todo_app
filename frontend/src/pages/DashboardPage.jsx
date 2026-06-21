import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/dashboard/StatsCard';
import CompletionChart from '../components/dashboard/CompletionChart';
import PriorityChart from '../components/dashboard/PriorityChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} variant="secondary" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { overview, priorityBreakdown, weeklyActivity } = stats || {};
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Total Tasks', value: overview?.total ?? 0, icon: '📋', color: 'blue' },
    { label: 'Completed', value: overview?.completed ?? 0, icon: '✅', color: 'green' },
    { label: 'Pending', value: overview?.pending ?? 0, icon: '⏳', color: 'yellow' },
    { label: 'In Progress', value: overview?.inProgress ?? 0, icon: '🔄', color: 'blue' },
    { label: 'Overdue', value: overview?.overdue ?? 0, icon: '🚨', color: 'red' },
    { label: "Today's Tasks", value: overview?.todayTasks ?? 0, icon: '📅', color: 'purple' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your productivity overview for today.
          </p>
        </div>
        <Link to="/todos">
          <Button leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            New Task
          </Button>
        </Link>
      </div>

      {/* Completion rate banner */}
      {overview?.total > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Completion</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {overview.completionRate}%
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900 flex items-center justify-center">
              <span className="text-lg font-bold text-primary-600">{overview.completionRate}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${overview.completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Activity
          </h2>
          <CompletionChart data={weeklyActivity || []} />
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Tasks by Priority
          </h2>
          <PriorityChart data={priorityBreakdown || { low: 0, medium: 0, high: 0 }} />
        </div>
      </div>
    </div>
  );
}
