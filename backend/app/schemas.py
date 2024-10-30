import datetime as _dt
import sqlalchemy.orm as _orm
import pydantic as _pydantic

class _UserBaseModel(_pydantic.BaseModel):
    full_name: str
    email: str
    tax_id: str
    phone_number: str


class _UserCreate(_UserBaseModel):
    hashed_password: str

    class Config:
        orm_mode = True

class _User(_UserBaseModel):
    user_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime
