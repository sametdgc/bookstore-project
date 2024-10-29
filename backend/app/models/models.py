from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = 'USERS'
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100),nullable=False) #i couldnt decide whether we would want this unique or not
    email = Column(String(100), unique=True, nullable=False) 
    tax_id= Column(String(50), unique=True) #db desing doesnt state unqiue but i think it should be
    phone_number = Column(String(50)) #for now not unqiue, but could be
    password = Column(String(100), unique=True, nullable=False )
    #creted_at = Column(DateTime, default=datetime.datetime.utcnow) bir de bunu on update current timestamp yapacağız
    #maybe in order to not deal with bs date formatting we can make the daettime a string and deal with it in the backend


