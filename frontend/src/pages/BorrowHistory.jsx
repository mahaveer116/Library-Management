import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getMyBorrowHistory } from '../services/api';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const BorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getMyBorrowHistory();
      setBorrowHistory(data);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-600 mt-1">Your complete borrow history</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading history...</div>
          </div>
        ) : borrowHistory.length > 0 ? (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Book</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Return Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowHistory.map((record) => {
                    const isOverdue =
                      record.status === 'ISSUED' && new Date(record.due_date) < new Date();
                    return (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{record.book?.title}</p>
                            <p className="text-sm text-gray-500">{record.book?.author}</p>
                            <p className="text-xs text-gray-400 mt-1">ISBN: {record.book?.isbn}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {format(new Date(record.issue_date), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={
                              isOverdue
                                ? 'text-red-600 font-medium'
                                : 'text-gray-700'
                            }
                          >
                            {format(new Date(record.due_date), 'MMM dd, yyyy')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {record.return_date
                            ? format(new Date(record.return_date), 'MMM dd, yyyy')
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {record.status === 'RETURNED' ? (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              Returned
                            </span>
                          ) : isOverdue ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Overdue
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">You haven't borrowed any books yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BorrowHistory;

