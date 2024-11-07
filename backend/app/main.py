from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
import models, schemas
import datetime as _dt
import asyncio
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize FastAPI
app = FastAPI()

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Function to create a user (for testing purposes without an endpoint)
async def create_user_for_test():
    # Example user data (this should be similar to what you want to insert)
    user = schemas.UserCreate(
       #user_id=1,   #ID should be generated automatically if needed
        full_name="John Doe",
        email="john.doe@example.com",
        tax_id="1234567890",
        phone_number="+123456789",
        hashed_password="securepassword",  # You should hash the password here
        role_id=1  #I have added the role_id 1 as the admin in the table to not get reference error
    )
    
    # Hash the password before storing
    hashed_password = models.User.create_password_hash(user.hashed_password)
    user_data = {
        #"user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "tax_id": user.tax_id,
        "phone_number": user.phone_number,
        "hashed_password": hashed_password,
        "created_at": _dt.datetime.now().isoformat(),  # Convert to ISO 8601 string
        "updated_at": _dt.datetime.now().isoformat(),  # Convert to ISO 8601 string
        "role_id": user.role_id,  
    }
    
    # Insert the new user into Supabase
    response = supabase.table("users").insert(user_data).execute()



# Run the function to create a user (no need for frontend, just testing in terminal)
if __name__ == "__main__":
    # Use asyncio to run the asynchronous function
    asyncio.run(create_user_for_test())