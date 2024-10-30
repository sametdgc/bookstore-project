import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import sqlalchemy as _sql
import database as  _database



class User(_database.Base):
    __tablename__ = 'USERS'
    user_id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    full_name = _sql.Column( _sql.String(100),nullable=False) #i couldnt decide whether we would want this unique or not
    email =  _sql.Column( _sql.String(100), unique=True, nullable=False) 
    tax_id=  _sql.Column( _sql.String(50), unique=True) #db desing doesnt state unqiue but i think it should be
    phone_number =  _sql.Column( _sql.String(50)) #for now not unqiue, but could be
    hashed_password =  _sql.Column( _sql.String(128), unique=True, nullable=False )
    date_created = _sql.Column(_sql.DateTime,  default=_dt.datetime.now())# bir de bunu on update current timestamp yapacağız
    date_last_updated = _sql.Column(_sql.DateTime,  default=_dt.datetime.now())
    #In order to not deal with date formatting we can make the daettime a string. But whatever...

    def verif_password(self, password=str) -> bool:
        return _hash.bcrypt.verify(password, self.hashed_password)



