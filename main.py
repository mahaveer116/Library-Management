from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import session,engine
from fastapi.middleware.cors import CORSMiddleware
import databasemodel
from model import books, userRegister, userLogin, student, borrow_record
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, date
import hashlib
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

# Add OAuth2 schemes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

databasemodel.Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # allowed frontend origin
    allow_credentials=True,
    allow_methods=["*"],   # allow all HTTP methods
    allow_headers=["*"],   # allow all headers
)


#Hashing password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    sha = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(sha)

def verify_password(plain_password, hashed_password):
    sha = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return pwd_context.verify(sha, hashed_password)

#JWT toekn creation
SECRET_KEY = "MY_SECRET_KEY_123" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    
    user = db.query(databasemodel.user).filter(databasemodel.user.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def role_required(allowed_roles: list[str]):
    def role_checker(current_user: Annotated[databasemodel.user, Depends(get_current_user)]):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail="You don't have permission to access this resource."
            )
        return current_user
    return role_checker

#User registration
@app.post("/api/auth/register")
def register(us: userRegister, db: Session = Depends(get_db)):
    existing_user = db.query(databasemodel.user).filter(databasemodel.user.email == us.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = databasemodel.user(
        name=us.name,
        email=us.email,
        role=us.role,
        password=hash_password(us.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    return {
        "token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }

#Login user
@app.post("/api/auth/login")
def login(us: userLogin, db: Session = Depends(get_db)):
    db_user = db.query(databasemodel.user).filter(databasemodel.user.email == us.email).first()
    if not db_user or not verify_password(us.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    return {
        "token": token,
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role
        }
    }

# GET all books
@app.get("/api/books")
def get_allbooks(db: Session = Depends(get_db)):
    return db.query(databasemodel.books).all()

# GET book by ID
@app.get("/api/books/{id}")
def get_bookbyid(id: int, db: Session = Depends(get_db)):
    book = db.query(databasemodel.books).filter(databasemodel.books.id == id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# Admin / Librarian
@app.post("/api/books", dependencies=[Depends(role_required(["admin", "librarian"]))])
def create_book(bo: books, db: Session = Depends(get_db)):
    db_book = databasemodel.books(
        title=bo.title,
        author=bo.author,
        isbn=bo.isbn,
        total_copies=bo.total_copies,
        available_copies=bo.total_copies # Set available to total on create
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# Admin / Librarian
@app.put("/api/books/{id}", dependencies=[Depends(role_required(["admin", "librarian"]))])
def update_book(id: int, bo: books, db: Session = Depends(get_db)):
    db_book = db.query(databasemodel.books).filter(databasemodel.books.id == id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db_book.title = bo.title
    db_book.author = bo.author
    db_book.isbn = bo.isbn
    db_book.total_copies = bo.total_copies
    db_book.available_copies = bo.available_copies
    db.commit()
    return db_book

# Admin / Librarian
@app.delete("/api/books/{id}", dependencies=[Depends(role_required(["admin", "librarian"]))])
def delete_book(id: int, db: Session = Depends(get_db)):
    db_book = db.query(databasemodel.books).filter(databasemodel.books.id == id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"}

# Get all students
@app.get("/api/students", dependencies=[Depends(role_required(["admin", "librarian"]))])
def get_allstudents(db: Session = Depends(get_db)):
    return db.query(databasemodel.student).all()    

# Get student by ID
@app.get("/api/students/{id}", dependencies=[Depends(role_required(["admin", "librarian"]))])
def get_studentbyid(id: int, db: Session = Depends(get_db)):
    student = db.query(databasemodel.student).filter(databasemodel.student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

# Admin only Create student
@app.post("/api/students", dependencies=[Depends(role_required(["admin"]))])
def create_student(st: student, db: Session = Depends(get_db)):
    db_student = databasemodel.student(
        name=st.name,
        email=st.email,
        roll_no=st.roll_no,
        department=st.department,
        join_date=st.join_date
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# Update student
@app.put("/api/students/{id}", dependencies=[Depends(role_required(["admin", "librarian"]))])
def update_student(id: int, st: student, db: Session = Depends(get_db)):
    db_student = db.query(databasemodel.student).filter(databasemodel.student.id == id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    db_student.name = st.name
    db_student.email = st.email
    db_student.roll_no = st.roll_no
    db_student.department = st.department
    db_student.join_date = st.join_date
    db.commit()
    return db_student

# Delete a student
@app.delete("/api/students/{id}", dependencies=[Depends(role_required(["admin", "librarian"]))])
def delete_student(id: int, db: Session = Depends(get_db)):
    db_student = db.query(databasemodel.student).filter(databasemodel.student.id == id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}

# Get borrow history for a student
@app.get("/api/students/{id}/borrow-history", dependencies=[Depends(role_required(["admin", "librarian"]))])
def get_borrow_history(id: int, db: Session = Depends(get_db)):
    records = db.query(databasemodel.borrow_record).filter(databasemodel.borrow_record.student_id == id).all()
    return records

# Get all borrow records
@app.get("/api/borrow-records", dependencies=[Depends(role_required(["admin", "librarian"]))])
def get_all_borrow_records(db: Session = Depends(get_db)):
    return db.query(databasemodel.borrow_record).all()

# Issue a book
@app.post("/api/borrow-records/issue", dependencies=[Depends(role_required(["admin", "librarian"]))])
def issue_book(req: borrow_record, db: Session = Depends(get_db)):
    book = db.query(databasemodel.books).filter(databasemodel.books.id == req.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="Book is not available")
    
    student = db.query(databasemodel.student).filter(databasemodel.student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_record = databasemodel.borrow_record(
        student_id=req.student_id,
        book_id=req.book_id,
        issue_date=date.today(),
        due_date=date.today() + timedelta(days=30),
        status="ISSUED"
    )
    book.available_copies -= 1
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

# Return a book
@app.post("/api/borrow-records/{id}/return", dependencies=[Depends(role_required(["admin", "librarian"]))])
def return_book(id: int, db: Session = Depends(get_db)):
    record = db.query(databasemodel.borrow_record).filter(databasemodel.borrow_record.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if record.status == "RETURNED":
        return {"message": "Book already returned"}
    
    record.return_date = date.today()
    record.status = "RETURNED"
    book = db.query(databasemodel.books).filter(databasemodel.books.id == record.book_id).first()
    if book:
        book.available_copies += 1
        
    db.commit()
    return {"message": "Book returned successfully"}

# Get my history (Student)
@app.get("/api/borrow-records/my-history")
def get_my_history(current_user: Annotated[databasemodel.user, Depends(get_current_user)], db: Session = Depends(get_db)):
    student_profile = db.query(databasemodel.student).filter(databasemodel.student.email == current_user.email).first()
    if not student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    records = db.query(databasemodel.borrow_record).filter(databasemodel.borrow_record.student_id == student_profile.id).all()
    return records

# Dashboard Statistics
@app.get("/api/dashboard/stats", dependencies=[Depends(role_required(["admin", "librarian"]))])
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_books = db.query(databasemodel.books).count()
    issued_books = db.query(databasemodel.borrow_record).filter(databasemodel.borrow_record.status == "ISSUED").count()
    
    # Calculate available_books by fetching all books and summing available_copies in Python
    # This is safer than complex SQL if the schema/dialects are causing issues
    all_books = db.query(databasemodel.books).all()
    available_books = sum(book.available_copies for book in all_books)
    
    overdue_books = db.query(databasemodel.borrow_record).filter(
        databasemodel.borrow_record.status == "ISSUED",
        databasemodel.borrow_record.due_date < date.today()
    ).count()
    
    return {
        "total_books": total_books,
        "issued_books": issued_books,
        "available_books": available_books,
        "overdue_books": overdue_books,
    }





