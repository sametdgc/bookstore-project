from config import SUPABASE_URL, SUPABASE_KEY
import schemas as _schemas
import services as _services
import datetime as _dt
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware #needed to allow requests from frontend


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
async def register_user(user: _schemas._UserCreate):

    response = supabase.table("users").select("*").eq("email", user.email).execute()
    if response.data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    result = supabase.table("users").insert({
        "email": user.email,
        "hashed_password": _services.get_password_hash(user.password),  # Assuming password hashing logic is in _services
        "created_at": _dt.datetime.utcnow()
    }).execute()

    if result.error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user")
    
    return {"message": "User registered successfully"}

@app.post("/api/token")
async def generate_token(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # Authenticate user using Supabase query
    response = supabase.table("users").select("*").eq("email", form_data.username).execute()
    user = response.data[0] if response.data else None
    
    if not user or not _services.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Create and return the token
    return _services.create_token(user)