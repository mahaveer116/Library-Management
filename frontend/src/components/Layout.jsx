import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  PlusCircle,
  ArrowLeftRight,
  History,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/books/add', label: 'Add Book', icon: PlusCircle },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/students/add', label: 'Add Student', icon: PlusCircle },
    { path: '/issue-book', label: 'Issue Book', icon: ArrowLeftRight },
    { path: '/return-book', label: 'Return Book', icon: ArrowLeftRight },
  ];

  const librarianLinks = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/books/add', label: 'Add Book', icon: PlusCircle },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/issue-book', label: 'Issue Book', icon: ArrowLeftRight },
    { path: '/return-book', label: 'Return Book', icon: ArrowLeftRight },
  ];

  const studentLinks = [
    { path: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/my-books', label: 'My Books', icon: History },
  ];

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'librarian' 
    ? librarianLinks 
    : studentLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600">Library System</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-primary-600">Library System</h1>
              <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role}</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(link.path)
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="px-4 py-3 mb-2">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

