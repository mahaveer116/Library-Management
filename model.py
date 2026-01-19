from pydantic import BaseModel
from datetime import date
from typing import Optional

class books(BaseModel):
    id: Optional[int] = None
    title: str
    author: str
    isbn: str
    total_copies: int
    available_copies: int

class userRegister(BaseModel):
    email: str
    name: str
    role: str
    password: str

class userLogin(BaseModel):
    email: str
    password: str

class student(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    roll_no: str
    department: str
    join_date: date

class borrow_record(BaseModel):
    id: Optional[int] = None
    student_id: int
    book_id: int
    issue_date: date
    due_date: date
    return_date: Optional[date] = None
    status: Optional[str] = "ISSUED"
