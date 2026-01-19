import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getStudents, getBooks, issueBook } from '../services/api';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const IssueBook = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    book_id: '',
  });
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, booksData] = await Promise.all([getStudents(), getBooks()]);
      setStudents(studentsData);
      setBooks(booksData.filter((book) => book.available_copies > 0));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await issueBook(formData);
      setSuccess('Book issued successfully!');
      setFormData({ student_id: '', book_id: '' });
      // Refresh available books
      const booksData = await getBooks();
      setBooks(booksData.filter((book) => book.available_copies > 0));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedBook = books.find((book) => book.id === parseInt(formData.book_id));

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Issue Book</h1>
            <p className="text-gray-600 mt-1">Issue a book to a student</p>
          </div>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading data...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="student_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Student *
                </label>
                <select
                  id="student_id"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Choose a student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.roll_no}) - {student.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="book_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Book *
                </label>
                <select
                  id="book_id"
                  name="book_id"
                  value={formData.book_id}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Choose a book...</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author} (Available: {book.available_copies})
                    </option>
                  ))}
                </select>
                {books.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No books available for issuing.</p>
                )}
              </div>

              {selectedBook && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Book Details:</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Title:</span> {selectedBook.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Author:</span> {selectedBook.author}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ISBN:</span> {selectedBook.isbn}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Available Copies:</span>{' '}
                    {selectedBook.available_copies}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin-dashboard')}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || books.length === 0}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Issuing...' : 'Issue Book'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IssueBook;

