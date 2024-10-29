from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware #needed to allow requests from frontend

app = FastAPI()

origins = [
    'http://localhost:3000' #i am now allowing requests from this origin,
    #planning to make this the fronend url, we will change this. 
    #this isnt that secure, but for the first sprint let it be. 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)


class RegisterUser(BaseModel):
    full_name: str
    email: str
    tax_id: str
    phone_number: str
    password: str

class RegisterModel(RegisterUser):
    user_id: int

    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterModel)
async def register_user(user: RegisterUser, db: db_dependency):
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#@app.get("/")
#async def read_root():
#    return {"message": "Welcome to the Bookstore API"}
