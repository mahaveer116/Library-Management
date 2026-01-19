import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { createBook } from '../services/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    total_copies: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createBook({
        ...formData,
        total_copies: parseInt(formData.total_copies),
      });
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/books')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
            <p className="text-gray-600 mt-1">Enter book details</p>
          </div>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                id="isbn"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter ISBN number"
              />
            </div>

            <div>
              <label
                htmlFor="total_copies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Copies *
              </label>
              <input
                id="total_copies"
                name="total_copies"
                type="number"
                min="1"
                value={formData.total_copies}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter number of copies"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;

