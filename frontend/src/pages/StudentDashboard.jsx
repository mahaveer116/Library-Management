import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getMyBorrowHistory } from '../services/api';
import { BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const data = await getMyBorrowHistory();
      setBorrowHistory(data);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
    } finally {
      setLoading(false);
    }
  };

  const issuedBooks = borrowHistory.filter((record) => record.status === 'ISSUED');
  const overdueBooks = issuedBooks.filter((book) => {
    const dueDate = new Date(book.due_date);
    return dueDate < new Date() && book.status === 'ISSUED';
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Your library activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Books Issued</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{issuedBooks.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <BookOpen className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{overdueBooks.length}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{borrowHistory.length}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Calendar className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading your books...</div>
          </div>
        ) : issuedBooks.length > 0 ? (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Issued Books</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Book</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((record) => {
                    const isOverdue = new Date(record.due_date) < new Date();
                    return (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{record.book?.title}</p>
                            <p className="text-sm text-gray-500">{record.book?.author}</p>
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
                        <td className="py-3 px-4">
                          {isOverdue ? (
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

export default StudentDashboard;

