# Library Management System - API Endpoints Documentation

Base URL: `http://localhost:8000/api` (or your backend URL)

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // "admin" | "librarian" | "student"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📚 Book Endpoints

### 3. Get All Books
**GET** `/books`

**Access:** Admin, Librarian, Student

**Response:**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "total_copies": 5,
    "available_copies": 3,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 4. Get Book by ID
**GET** `/books/:id`

**Access:** Admin, Librarian, Student

**Response:**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "total_copies": 5,
  "available_copies": 3,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. Create Book
**POST** `/books`

**Access:** Admin, Librarian

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "total_copies": 5
}
```

**Response:**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "total_copies": 5,
  "available_copies": 5,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Note:** `available_copies` should be set equal to `total_copies` when creating.

---

### 6. Update Book
**PUT** `/books/:id`

**Access:** Admin, Librarian

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "isbn": "978-0-7432-7356-5",
  "total_copies": 10
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "author": "Updated Author",
  "isbn": "978-0-7432-7356-5",
  "total_copies": 10,
  "available_copies": 8,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 7. Delete Book
**DELETE** `/books/:id`

**Access:** Admin, Librarian

**Response:**
```json
{
  "message": "Book deleted successfully"
}
```

---

## 👨‍🎓 Student Endpoints

### 8. Get All Students
**GET** `/students`

**Access:** Admin, Librarian

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "roll_no": "STU001",
    "department": "Computer Science",
    "email": "john@university.edu",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 9. Get Student by ID
**GET** `/students/:id`

**Access:** Admin, Librarian

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "roll_no": "STU001",
  "department": "Computer Science",
  "email": "john@university.edu",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 10. Create Student
**POST** `/students`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "John Doe",
  "roll_no": "STU001",
  "department": "Computer Science",
  "email": "john@university.edu"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "roll_no": "STU001",
  "department": "Computer Science",
  "email": "john@university.edu",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 11. Update Student
**PUT** `/students/:id`

**Access:** Admin, Librarian

**Request Body:**
```json
{
  "name": "John Updated",
  "roll_no": "STU001",
  "department": "Mathematics",
  "email": "john@university.edu"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Updated",
  "roll_no": "STU001",
  "department": "Mathematics",
  "email": "john@university.edu",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 12. Delete Student
**DELETE** `/students/:id`

**Access:** Admin, Librarian

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

---

### 13. Get Student Borrow History
**GET** `/students/:id/borrow-history`

**Access:** Admin, Librarian

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "book_id": 1,
    "issue_date": "2024-01-20",
    "due_date": "2024-02-20",
    "return_date": null,
    "status": "ISSUED",
    "book": {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5"
    }
  }
]
```

---

## 🔗 Borrow Record Endpoints

### 14. Get All Borrow Records
**GET** `/borrow-records`

**Access:** Admin, Librarian

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "book_id": 1,
    "issue_date": "2024-01-20",
    "due_date": "2024-02-20",
    "return_date": null,
    "status": "ISSUED",
    "student": {
      "id": 1,
      "name": "John Doe",
      "roll_no": "STU001",
      "department": "Computer Science"
    },
    "book": {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5"
    }
  }
]
```

---

### 15. Get Borrow Record by ID
**GET** `/borrow-records/:id`

**Access:** Admin, Librarian

**Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "book_id": 1,
  "issue_date": "2024-01-20",
  "due_date": "2024-02-20",
  "return_date": null,
  "status": "ISSUED",
  "student": {
    "id": 1,
    "name": "John Doe",
    "roll_no": "STU001"
  },
  "book": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald"
  }
}
```

---

### 16. Issue Book
**POST** `/borrow-records/issue`

**Access:** Admin, Librarian

**Request Body:**
```json
{
  "student_id": 1,
  "book_id": 1
}
```

**Business Logic:**
- Check if `available_copies > 0`
- Create borrow record with `status: "ISSUED"`
- Set `issue_date` to current date
- Set `due_date` to 30 days from issue date (or your policy)
- Decrease `available_copies` by 1
- Set `return_date` to `null`

**Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "book_id": 1,
  "issue_date": "2024-01-20",
  "due_date": "2024-02-20",
  "return_date": null,
  "status": "ISSUED",
  "student": {
    "id": 1,
    "name": "John Doe",
    "roll_no": "STU001"
  },
  "book": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald"
  }
}
```

**Error Response (if book unavailable):**
```json
{
  "message": "Book is not available"
}
```

---

### 17. Return Book
**POST** `/borrow-records/:id/return`

**Access:** Admin, Librarian

**Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "book_id": 1,
  "issue_date": "2024-01-20",
  "due_date": "2024-02-20",
  "return_date": "2024-02-15",
  "status": "RETURNED",
  "student": {
    "id": 1,
    "name": "John Doe"
  },
  "book": {
    "id": 1,
    "title": "The Great Gatsby"
  }
}
```

**Business Logic:**
- Update `status` to `"RETURNED"`
- Set `return_date` to current date
- Increase `available_copies` by 1

---

### 18. Get My Borrow History (Student)
**GET** `/borrow-records/my-history`

**Access:** Student (returns only their own records)

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "book_id": 1,
    "issue_date": "2024-01-20",
    "due_date": "2024-02-20",
    "return_date": null,
    "status": "ISSUED",
    "book": {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5"
    }
  }
]
```

---

## 📊 Dashboard Endpoints

### 19. Get Dashboard Statistics
**GET** `/dashboard/stats`

**Access:** Admin, Librarian

**Response:**
```json
{
  "total_books": 150,
  "issued_books": 45,
  "available_books": 105,
  "overdue_books": 5
}
```

**Business Logic:**
- `total_books`: Count of all books
- `issued_books`: Count of borrow records with `status: "ISSUED"`
- `available_books`: Sum of all `available_copies`
- `overdue_books`: Count of issued books where `due_date < current_date` and `status: "ISSUED"`

---

## 🔒 Role-Based Access Summary

| Endpoint | Admin | Librarian | Student |
|----------|-------|-----------|---------|
| Register/Login | ✅ | ✅ | ✅ |
| Get Books | ✅ | ✅ | ✅ |
| Create/Update/Delete Books | ✅ | ✅ | ❌ |
| Get Students | ✅ | ✅ | ❌ |
| Create Student | ✅ | ❌ | ❌ |
| Update/Delete Student | ✅ | ✅ | ❌ |
| Issue/Return Books | ✅ | ✅ | ❌ |
| Get All Borrow Records | ✅ | ✅ | ❌ |
| Get My Borrow History | ❌ | ❌ | ✅ |
| Dashboard Stats | ✅ | ✅ | ❌ |

---

## 📝 Error Responses

All endpoints should return appropriate error responses:

**401 Unauthorized:**
```json
{
  "message": "Unauthorized. Please login."
}
```

**403 Forbidden:**
```json
{
  "message": "You don't have permission to access this resource."
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found."
}
```

**400 Bad Request:**
```json
{
  "message": "Validation error",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error"
}
```

---

## 🔑 JWT Token Structure

The JWT token should contain:
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "admin"
}
```

Token expiration: Recommended 24 hours or as per your security policy.

---

## 📌 Important Notes

1. **Password Hashing**: Always hash passwords before storing (use bcrypt or similar)
2. **JWT Security**: Use secure secret keys and validate tokens on every request
3. **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for dates
4. **Available Copies**: Always maintain `available_copies <= total_copies`
5. **Due Date Calculation**: Typically 30 days from issue date (adjust as needed)
6. **Overdue Calculation**: Check `due_date < current_date` AND `status = "ISSUED"`

