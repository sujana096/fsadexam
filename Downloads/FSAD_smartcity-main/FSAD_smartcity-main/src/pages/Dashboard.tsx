import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  Building2, 
  ClipboardList, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const { user } = useAuth();
  const { services, reports, feedbacks, cityInfo } = useData();

  const stats = useMemo(() => {
    const activeServices = services.filter(s => s.status === 'Active').length;
    const pendingReports = reports.filter(r => r.status === 'Pending').length;
    const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
    const avgRating = feedbacks.length > 0 
      ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
      : 'N/A';

    return [
      { name: 'Total Services', value: services.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
      { name: 'Pending Reports', value: pendingReports, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
      { name: 'Resolved Reports', value: resolvedReports, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      { name: 'Avg. Feedback', value: avgRating, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];
  }, [services, reports, feedbacks]);

  const serviceStatusData = {
    labels: ['Active', 'Maintenance'],
    datasets: [
      {
        data: [
          services.filter(s => s.status === 'Active').length,
          services.filter(s => s.status === 'Maintenance').length,
        ],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const reportStatusData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Reports',
        data: [
          reports.filter(r => r.status === 'Pending').length,
          reports.filter(r => r.status === 'In Progress').length,
          reports.filter(r => r.status === 'Resolved').length,
        ],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 dark:text-slate-400">Here's what's happening in SmartCity today.</p>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-slate-800">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Population: {cityInfo.population}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className={stat.bg + " rounded-lg p-2"}>
                  <Icon className={"h-6 w-6 " + stat.color} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Report Status Breakdown</h3>
          <div className="h-64">
            <Bar 
              data={reportStatusData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
              }} 
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Service Availability</h3>
          <div className="flex h-64 items-center justify-center">
            <div className="w-64">
              <Pie data={serviceStatusData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
        <div className="border-b border-slate-100 p-6 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Reports</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {reports.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No reports yet.</div>
          ) : (
            reports.slice(-5).reverse().map((report) => (
              <div key={report.id} className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-700">
                    <AlertCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{report.issueTitle}</p>
                    <p className="text-sm text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                  report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {report.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
