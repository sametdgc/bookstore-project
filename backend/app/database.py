import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import sqlalchemy.ext.declarative as _declarative

'''
Used to use this but we don use mysql anymore, remove when sure.

URL_DB = 'mysql+pymysql://root:test123456test@localhost:3306/ChapterZero' 
#after the column you should write your_password: username:password , root:test123456test
#after the localhost you should write the name_of_your_database for now i said ChapterZero
engine = _sql.create_engine(URL_DB)
SessionLocal = _orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = _declarative.declarative_base()
'''