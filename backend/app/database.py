from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


URL_DB = 'mysql+pymysql://root:test123456test@localhost:3306/ChapterZero' 
#after the column you should write your_password: username:password , root:test123456test
#after the localhost you should write the name_of_your_database for now i said ChapterZero
 
engine = create_engine(URL_DB)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

