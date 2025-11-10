import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';
import { User, Assignment, Payment } from '../types';

interface PlatformAnalyticsData {
  totalUsers: number;
  studentCount: number;
  tutorCount: number;
  totalVolume: number;
  platformRevenue: number;
  recentPayments: Payment[];
}

const PlatformAnalytics = () => {
    const [data, setData] = useState<PlatformAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApi.getPlatformAnalytics().then(analyticsData => {
            setData(analyticsData);
            setLoading(false);
        });
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    if (loading) {
        return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading analytics...</div>;
    }
    
    if (!data) {
        return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Could not load analytics data.</div>;
    }
    
    const MetricCard: React.FC<{title: string, value: string | number, description?: string}> = ({title, value, description}) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
    );
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Platform Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">An overview of platform performance and financials.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Volume" value={formatCurrency(data.totalVolume)} description="Total value of completed jobs" />
                <MetricCard title="Platform Revenue" value={formatCurrency(data.platformRevenue)} description="10% commission on completed jobs" />
                <MetricCard title="Total Users" value={data.totalUsers} description={`${data.studentCount} Students / ${data.tutorCount} Tutors`} />
                <MetricCard title="Completed Jobs" value={data.recentPayments.length} />
            </div>
            
            <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Assignment</th>
                                <th scope="col" className="px-6 py-3">Student / Tutor</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentPayments.map(p => (
                                <tr key={p.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{p.assignmentTitle}</td>
                                    <td className="px-6 py-4">
                                        <div>{p.studentName}</div>
                                        <div className="text-xs text-gray-500">{p.tutorName}</div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold">{formatCurrency(p.amount)}</td>
                                    <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 font-semibold">{formatCurrency(p.platformFee)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data.recentPayments.length === 0 && <p className="text-center py-8 text-gray-500">No transactions have been recorded yet.</p>}
            </div>
        </div>
    );
};


const MainDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [usersData, assignmentsData] = await Promise.all([
        mockApi.getAllUsers(),
        mockApi.getAllAssignments(),
      ]);
      setUsers(usersData);
      setAssignments(assignmentsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading platform data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Users ({users.length})</h2>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <li key={user.id} className="py-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-xs capitalize mt-1 inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{user.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assignments ({assignments.length})</h2>
          <div className="overflow-y-auto max-h-96">
             <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map(assignment => (
                <li key={assignment.id} className="py-3">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{assignment.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Student: {assignment.studentName}</p>
                   <p className="text-xs capitalize mt-1 inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{assignment.status}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ view }: { view: 'dashboard' | 'analytics' }) {
    switch(view) {
        case 'analytics':
            return <PlatformAnalytics />;
        case 'dashboard':
        default:
            return <MainDashboard />;
    }
}
