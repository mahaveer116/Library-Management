from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from database import Base   
from datetime import datetime

class books(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    isbn = Column(String)
    total_copies = Column(Integer)
    available_copies = Column(Integer)

class user(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    password = Column(String)

class student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    roll_no = Column(String,unique=True,index=True)
    department = Column(String)
    join_date = Column(Date)

class borrow_record(Base):
    __tablename__ = "borrow_records"
    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)

    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    return_date = Column(Date, nullable=True)

    status = Column(String(20), nullable=False)