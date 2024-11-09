from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
import app.schemas.schemas as schemas, app.routers.services as services
import datetime as _dt
from app.config import SUPABASE_URL, SUPABASE_KEY
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import FastAPI, HTTPException, status, Depends



# Initialize FastAPI
app = FastAPI()

origins = [
    'http://localhost:3000' #i am now allowing requests from th3se origin,
    'http://localhost:5173' 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.post("/api/users", status_code=status.HTTP_201_CREATED)
async def register_user(user: schemas.UserCreate):

    response = supabase.table("users").select("*").eq("email", user.email).execute()
    if response.data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    result = supabase.table("users").insert({
        "full_name": user.full_name,
        "email": user.email,
        "hashed_password": user.hashed_password,
        "created_at": _dt.datetime.utcnow().isoformat(),
        "role_id": user.role_id  # Ensure role_id is included here
    }).execute() 
    return {"message": "User registered successfully"}

@app.post("/api/token")
async def generate_token(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # Authenticate user using Supabase query
    response = supabase.table("users").select("*").eq("email", form_data.username).execute()
    user = response.data[0] if response.data else None
    
    if not user or not services.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Create and return the token
    return services.create_token(user)