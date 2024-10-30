import fastapi as _fastapi
import fastapi.security as _security
from sqlalchemy.orm import Session
from typing import Annotated, List
import services as _services
import models as _models
import schemas as _schemas
from fastapi.middleware.cors import CORSMiddleware #needed to allow requests from frontend
from database import SessionLocal, engine, Base

app = _fastapi.FastAPI()

origins = [
    'http://localhost:3000' #i am now allowing requests from th3se origin,
    'http://localhost:5173' 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, _fastapi.Depends(get_db)]

Base.metadata.create_all(bind=engine)

@app.post("/api/users", status_code=_fastapi.status.HTTP_201_CREATED)
async def register_user(
    user: _schemas._UserCreate, db: db_dependency):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=_fastapi.status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return await _services.create_user(user, db)

@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), 
    db: db_dependency = db_dependency
):
    user = await _services.authenticate_user(form_data.username, #email for us
                                             form_data.password, 
                                             db)
    if not user:
        raise _fastapi.HTTPException(status_code=_fastapi.status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return await _services.create_token(user, db)