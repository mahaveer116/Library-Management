import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getDashboardStats } from '../services/api';
import { BookOpen, BookCheck, BookX, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_books: 0,
    issued_books: 0,
    available_books: 0,
    overdue_books: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.total_books,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Issued Books',
      value: stats.issued_books,
      icon: BookCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Available Books',
      value: stats.available_books,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Overdue Books',
      value: stats.overdue_books,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of library statistics</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading statistics...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`${stat.color} text-white`} size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;

