import datetime as _dt
import passlib.hash as _hash
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    user_id: int
    full_name: str
    email: str
    tax_id: str
    phone_number: str
    hashed_password: str
    role_id: Optional[int] = None
    date_created: _dt.datetime = _dt.datetime.now()
    date_last_updated: _dt.datetime = _dt.datetime.now()

    # Verify password function
    def verify_password(self, password: str) -> bool:
        return _hash.bcrypt.verify(password, self.hashed_password)

    @classmethod
    def create_password_hash(cls, password: str) -> str:
        return _hash.bcrypt.hash(password)

class Address(BaseModel):
    address_id: int
    street: str
    city: str
    state: str
    postal_code: str
    country: str

class UserAddress(BaseModel):
    user_id: int
    address_id: int

class Author(BaseModel):
    author_id: int
    full_name: str

class Genre(BaseModel):
    genre_id: int
    genre_name: str

class Language(BaseModel):
    language_id: int
    language_name: str

class Publisher(BaseModel):
    publisher_id: int
    publisher_name: str

class Book(BaseModel):
    book_id: int
    title: str
    description: Optional[str] = None
    publication_year: Optional[int] = None
    publisher_id: int
    language_id: int
    genre_id: int
    price: float
    stock: Optional[int] = 0
    date_created: _dt.datetime = _dt.datetime.now()
    date_last_updated: _dt.datetime = _dt.datetime.now()

class BookImage(BaseModel):
    image_id: int
    book_id: int
    image_url: str

class BookReview(BaseModel):
    review_id: int
    book_id: int
    user_id: int
    rating: int
    review: Optional[str] = None
    date_created: _dt.datetime = _dt.datetime.now()

class CartItem(BaseModel):
    cart_item_id: int
    user_id: int
    book_id: int
    quantity: int

class Order(BaseModel):
    order_id: int
    user_id: int
    order_status: str
    total_price: float
    date_created: _dt.datetime = _dt.datetime.now()

class OrderItem(BaseModel):
    order_item_id: int
    order_id: int
    book_id: int
    quantity: int
    price: float

class PaymentMethod(BaseModel):
    payment_method_id: int
    user_id: int
    method: str

class Payment(BaseModel):
    payment_id: int
    order_id: int
    payment_method_id: int
    payment_date: _dt.datetime = _dt.datetime.now()
    amount: float

class BookTag(BaseModel):
    tag_id: int
    tag_name: str

class Discount(BaseModel):
    discount_id: int
    discount_code: str
    discount_percentage: float
    start_date: _dt.datetime
    end_date: _dt.datetime

class BookDiscount(BaseModel):
    book_id: int
    discount_id: int

class Wishlist(BaseModel):
    wishlist_id: int
    user_id: int

class WishlistItem(BaseModel):
    wishlist_item_id: int
    wishlist_id: int
    book_id: int

class BookAuthor(BaseModel):
    book_id: int
    author_id: int


class BookAuthor(BaseModel):
    book_id: int
    author_id: int