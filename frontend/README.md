# Library Management System - Frontend

A modern, responsive frontend for a Library Management System built with React and Tailwind CSS.

## Features

- 🔐 **Authentication & Authorization**
  - Login/Register pages
  - Role-based access control (Admin, Librarian, Student)
  - JWT token management

- 📊 **Dashboards**
  - Admin/Librarian Dashboard with statistics
  - Student Dashboard with personal book tracking

- 📚 **Book Management**
  - View all books with search functionality
  - Add new books (Admin/Librarian)
  - Track available copies

- 👨‍🎓 **Student Management**
  - View all students with search
  - Add new students (Admin only)

- 🔗 **Issue/Return Books**
  - Issue books to students
  - Return books
  - Track borrow history
  - Overdue book indicators

- 🎨 **Modern UI**
  - Responsive design
  - Beautiful Tailwind CSS styling
  - Mobile-friendly navigation

## Tech Stack

- **React 18** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Date-fns** - Date formatting
- **Vite** - Build tool

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar navigation
├── context/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── AdminDashboard.jsx  # Admin/Librarian dashboard
│   ├── StudentDashboard.jsx # Student dashboard
│   ├── Books.jsx           # Books list page
│   ├── AddBook.jsx         # Add book form
│   ├── Students.jsx        # Students list page
│   ├── AddStudent.jsx      # Add student form
│   ├── IssueBook.jsx       # Issue book form
│   ├── ReturnBook.jsx      # Return book page
│   └── BorrowHistory.jsx   # Student borrow history
├── services/
│   └── api.js              # API service functions
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## API Integration

The frontend expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Borrow Records
- `GET /api/borrow-records` - Get all borrow records
- `GET /api/borrow-records/:id` - Get borrow record by ID
- `POST /api/borrow-records/issue` - Issue a book
- `POST /api/borrow-records/:id/return` - Return a book
- `GET /api/borrow-records/my-history` - Get current user's borrow history

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

All API requests include JWT token in the Authorization header: `Bearer <token>`

## Role-Based Access

- **Admin**: Full access to all features
- **Librarian**: Can manage books, issue/return books, view students (cannot add students)
- **Student**: Can view books and their own borrow history

## License

MIT

