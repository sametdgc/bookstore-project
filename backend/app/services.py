import sqlalchemy.orm as _orm
import database as _database, models as _models, schemas as _schemas
import passlib.hash as _hash
import jwt as _jwt
from datetime import datetime

JWT_SECRET = "Lol, i wouldnt put this here but for now it is here"

async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()

async def create_user(user: _schemas._UserCreate, db: _orm.Session):
    user_obj = _models.User(email=user.email, 
                            full_name=user.full_name, 
                            tax_id=user.tax_id, 
                            phone_number=user.phone_number, 
                            hashed_password= _hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(email=email, db=db)
    if not user:
        return False
    if not user.verif_password(password):
        return False
    return user

async def create_token(user: _models.User, db: _orm.Session):
    user_obj = _schemas._User.model_validate(vars(user)) #model_validate will try to map the object to the schema
    # Prepare the payload
    
    payload = user_obj.model_dump()
    # Convert datetime fields to ISO format strings if necessary
    if isinstance(payload['date_created'], datetime):
        payload['date_created'] = payload['date_created'].isoformat()
    if isinstance(payload['date_last_updated'], datetime):
        payload['date_last_updated'] = payload['date_last_updated'].isoformat()

    token = _jwt.encode(
        user_obj.model_dump(),
        JWT_SECRET
    )
    return dict(access_token=token, token_type="bearer")
