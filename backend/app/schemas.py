import datetime as _dt
from pydantic import BaseModel
from typing import List, Optional

# User schema
class User(BaseModel):
    user_id: int
    full_name: str
    email: str
    tax_id: str
    phone_number: str
    hashed_password: str
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True


# User schema for creating a new user (does not require user_id, dates)
class UserCreate(BaseModel):
    full_name: str
    email: str
    tax_id: str
    phone_number: str
    hashed_password: str
    role_id: int  # assuming role_id is needed

    class Config:
        orm_mode = True


# Address schema
class Address(BaseModel):
    address_id: int
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str

    class Config:
        orm_mode = True

# UserAddress schema
class UserAddress(BaseModel):
    user_id: int
    address_id: int

    class Config:
        orm_mode = True

# Author schema
class Author(BaseModel):
    author_id: int
    full_name: str

    class Config:
        orm_mode = True

# Genre schema
class Genre(BaseModel):
    genre_id: int
    genre_name: str

    class Config:
        orm_mode = True

# Language schema
class Language(BaseModel):
    language_id: int
    language_name: str

    class Config:
        orm_mode = True

# Publisher schema
class Publisher(BaseModel):
    publisher_id: int
    publisher_name: str

    class Config:
        orm_mode = True

# Book schema
class Book(BaseModel):
    book_id: int
    title: str
    description: str
    price: float
    publication_date: _dt.datetime
    publisher_id: int
    language_id: int
    genre_id: int

    class Config:
        orm_mode = True

# BookImage schema
class BookImage(BaseModel):
    image_id: int
    book_id: int
    image_url: str

    class Config:
        orm_mode = True

# BookReview schema
class BookReview(BaseModel):
    review_id: int
    book_id: int
    user_id: int
    rating: float
    review_text: str
    date_created: _dt.datetime

    class Config:
        orm_mode = True

# CartItem schema
class CartItem(BaseModel):
    cart_item_id: int
    user_id: int
    book_id: int
    quantity: int

    class Config:
        orm_mode = True

# Order schema
class Order(BaseModel):
    order_id: int
    user_id: int
    total_price: float
    order_status: str
    order_date: _dt.datetime
    shipping_address_id: int

    class Config:
        orm_mode = True

# OrderItem schema
class OrderItem(BaseModel):
    order_item_id: int
    order_id: int
    book_id: int
    quantity: int
    price: float

    class Config:
        orm_mode = True

# PaymentMethod schema
class PaymentMethod(BaseModel):
    payment_method_id: int
    user_id: int
    card_number: str
    expiration_date: _dt.datetime

    class Config:
        orm_mode = True

# Payment schema
class Payment(BaseModel):
    payment_id: int
    order_id: int
    payment_method_id: int
    payment_date: _dt.datetime
    payment_status: str
    amount: float

    class Config:
        orm_mode = True

# BookTag schema
class BookTag(BaseModel):
    tag_id: int
    tag_name: str

    class Config:
        orm_mode = True

# Discount schema
class Discount(BaseModel):
    discount_id: int
    discount_code: str
    discount_percentage: float
    start_date: _dt.datetime
    end_date: _dt.datetime

    class Config:
        orm_mode = True

# BookDiscount schema
class BookDiscount(BaseModel):
    book_id: int
    discount_id: int

    class Config:
        orm_mode = True

# Wishlist schema
class Wishlist(BaseModel):
    wishlist_id: int
    user_id: int

    class Config:
        orm_mode = True

# WishlistItem schema
class WishlistItem(BaseModel):
    wishlist_item_id: int
    wishlist_id: int
    book_id: int

    class Config:
        orm_mode = True

# BookAuthor schema
class BookAuthor(BaseModel):
    book_id: int
    author_id: int

    class Config:
        orm_mode = True