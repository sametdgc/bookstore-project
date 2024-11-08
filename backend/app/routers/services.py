import app.models.models as _models 
from supabase import create_client, Client
from app.schemas import schemas 
import passlib.hash as _hash
import jwt as _jwt
from datetime import datetime
from app.config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

JWT_SECRET = "Lol, i wouldnt put this here but for now it is here"

async def get_user_by_email(email: str):
    # Query Supabase to get user by email
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None

async def create_user(user: schemas.UserCreate):
    # Create user object to insert into Supabase
    user_obj = _models.User(email=user.email, 
                            full_name=user.full_name, 
                            tax_id=user.tax_id,
                            phone_number=user.phone_number, 
                            hashed_password= _hash.bcrypt.hash(user.hashed_password))

    # Insert user into Supabase
    result = supabase.table("users").insert(user_obj).execute()

    if result.error:
        raise Exception("Error creating user")
    
    return result.data[0]  # Return the created user

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email=email)
    if not user:
        return False
    # Verify the password using passlib's bcrypt
    if not _hash.bcrypt.verify(password, user["hashed_password"]):
        return False
    return user

async def create_token(user: dict):
    # Assume `user` is already a dictionary from Supabase, convert to schema if needed
    user_obj = schemas._User.model_validate(user)

    # Prepare the payload for JWT
    payload = user_obj.model_dump()

    # Convert datetime fields to ISO format if necessary
    if isinstance(payload['date_created'], datetime):
        payload['date_created'] = payload['date_created'].isoformat()
    if isinstance(payload['date_last_updated'], datetime):
        payload['date_last_updated'] = payload['date_last_updated'].isoformat()

    token = _jwt.encode(payload, JWT_SECRET)
    return {"access_token": token, "token_type": "bearer"}