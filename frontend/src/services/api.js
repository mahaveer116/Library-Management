import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Book APIs
export const getBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

export const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

// Student APIs
export const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};

// Borrow Record APIs
export const getBorrowRecords = async () => {
  const response = await api.get('/borrow-records');
  return response.data;
};

export const getBorrowRecord = async (id) => {
  const response = await api.get(`/borrow-records/${id}`);
  return response.data;
};

export const issueBook = async (borrowData) => {
  const response = await api.post('/borrow-records/issue', borrowData);
  return response.data;
};

export const returnBook = async (id) => {
  const response = await api.post(`/borrow-records/${id}/return`);
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getStudentBorrowHistory = async (studentId) => {
  const response = await api.get(`/students/${studentId}/borrow-history`);
  return response.data;
};

export const getMyBorrowHistory = async () => {
  const response = await api.get('/borrow-records/my-history');
  return response.data;
};
