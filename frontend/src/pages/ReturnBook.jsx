import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getBorrowRecords, returnBook } from '../services/api';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ReturnBook = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowRecords();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = borrowRecords.filter(
        (record) =>
          record.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.student?.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.book?.isbn.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(borrowRecords);
    }
  }, [searchTerm, borrowRecords]);

  const fetchBorrowRecords = async () => {
    try {
      const data = await getBorrowRecords();
      const issuedRecords = data.filter((record) => record.status === 'ISSUED');
      setBorrowRecords(issuedRecords);
      setFilteredRecords(issuedRecords);
    } catch (error) {
      console.error('Error fetching borrow records:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleReturn = async (recordId) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await returnBook(recordId);
      setSuccess('Book returned successfully!');
      fetchBorrowRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Return Book</h1>
            <p className="text-gray-600 mt-1">Return issued books</p>
          </div>
        </div>

        {(error || success) && (
          <div className="card">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <span className="text-sm">{success}</span>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by student name, roll number, book title, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {loadingData ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading records...</div>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Book</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const isOverdue = new Date(record.due_date) < new Date();
                    return (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{record.student?.name}</p>
                            <p className="text-sm text-gray-500">{record.student?.roll_no}</p>
                          </div>
                        </td>
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
                          {isOverdue && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Overdue
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleReturn(record.id)}
                            disabled={loading}
                            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchTerm
                  ? 'No records found matching your search.'
                  : 'No books currently issued.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReturnBook;

