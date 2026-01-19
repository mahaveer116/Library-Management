import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getBooks } from '../services/api';
import { PlusCircle, Search, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-600 mt-1">Manage library books</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'librarian') && (
            <Link to="/books/add" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle size={20} />
              Add Book
            </Link>
          )}
        </div>

        <div className="card">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading books...</div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Author</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ISBN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total Copies</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Available</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{book.title}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{book.author}</td>
                      <td className="py-3 px-4 text-gray-700">{book.isbn}</td>
                      <td className="py-3 px-4 text-gray-700">{book.total_copies}</td>
                      <td className="py-3 px-4 text-gray-700">{book.available_copies}</td>
                      <td className="py-3 px-4">
                        {book.available_copies > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">
                {searchTerm ? 'No books found matching your search.' : 'No books available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Books;

