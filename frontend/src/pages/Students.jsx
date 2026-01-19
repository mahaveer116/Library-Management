import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getStudents } from '../services/api';
import { PlusCircle, Search, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">Manage student records</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/students/add" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle size={20} />
              Add Student
            </Link>
          )}
        </div>

        <div className="card">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading students...</div>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Roll Number</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{student.name}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{student.roll_no}</td>
                      <td className="py-3 px-4 text-gray-700">{student.department}</td>
                      <td className="py-3 px-4 text-gray-700">{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">
                {searchTerm ? 'No students found matching your search.' : 'No students registered.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Students;

