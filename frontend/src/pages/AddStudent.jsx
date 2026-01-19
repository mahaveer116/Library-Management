import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { createStudent } from '../services/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    department: '',
    email: '',
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
      await createStudent(formData);
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/students')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
            <p className="text-gray-600 mt-1">Enter student details</p>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number *
              </label>
              <input
                id="roll_no"
                name="roll_no"
                type="text"
                value={formData.roll_no}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter roll number"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter department"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter email address"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/students')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddStudent;

