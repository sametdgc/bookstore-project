from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean, Text, Enum, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
from pydantic import BaseModel

class Role(Base):
    _tablename_ = "Roles" 

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(20), unique=True, nullable=False)

    users = relationship("User", back_populates="role")

class User(Base):
    _tablename_ = "Users" 

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    tax_id = Column(String(50))
    phone_number = Column(String(20))
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    role_id = Column(Integer, ForeignKey("Roles.role_id"))

    role = relationship("Role", back_populates="users")
    addresses = relationship("UserAddress", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    cart = relationship("Cart", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="user")
    wishlist = relationship("Wishlist", back_populates="user")


class Address(Base):
    _tablename_ = "Addresses"  

    address_id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False)
    district = Column(String(100))
    address_details = Column(String(200))

    user_addresses = relationship("UserAddress", back_populates="address")

class UserAddress(Base):
    _tablename_ = "UserAddresses"  

    user_id = Column(Integer, ForeignKey("Users.user_id"), primary_key=True)
    address_id = Column(Integer, ForeignKey("Addresses.address_id"), primary_key=True)
    address_title = Column(String(50))

    user = relationship("User", back_populates="addresses")
    address = relationship("Address", back_populates="user_addresses")


class Genre(Base):
    _tablename_ = "Genres" 

    genre_id = Column(Integer, primary_key=True, index=True)
    genre_name = Column(String(100), unique=True, nullable=False)

    books = relationship("Book", back_populates="genre")


class Language(Base):
    _tablename_ = "Languages" 

    language_id = Column(Integer, primary_key=True, index=True)
    language_name = Column(String(10), unique=True, nullable=False)

    books = relationship("Book", back_populates="language")


class Author(Base):
    _tablename_ = "Authors" 

    author_id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(100), unique=True, nullable=False)

    books = relationship("Book", back_populates="author")

class Book(Base):
    _tablename_ = "Books" 

    book_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author_id = Column(Integer, ForeignKey("Authors.author_id"))
    publisher = Column(String(255))
    isbn = Column(String(13), unique=True)
    language_id = Column(Integer, ForeignKey("Languages.language_id"))
    image_url = Column(Text)
    genre_id = Column(Integer, ForeignKey("Genres.genre_id"))
    price = Column(DECIMAL(10, 2), nullable=False)
    available_quantity = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    genre = relationship("Genre", back_populates="books")
    language = relationship("Language", back_populates="books")
    author = relationship("Author", back_populates="books")
    reviews = relationship("Review", back_populates="book")
    cart_items = relationship("CartItem", back_populates="book")
    order_items = relationship("OrderItem", back_populates="book")
    discounts = relationship("BookDiscount", back_populates="book")
    wishlist_items = relationship("Wishlist", back_populates="book")

class Order(Base):
    _tablename_ = "Orders" 

    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"))
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    total_price = Column(DECIMAL(10, 2), nullable=False)
    address_id = Column(Integer, ForeignKey("Addresses.address_id"))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    delivery_status = relationship("DeliveryStatus", back_populates="order", uselist=False)
    invoice = relationship("Invoice", back_populates="order", uselist=False)


class OrderItem(Base):
    _tablename_ = "OrderItems" 

    order_id = Column(Integer, ForeignKey("Orders.order_id"), primary_key=True)
    book_id = Column(Integer, ForeignKey("Books.book_id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    item_price = Column(DECIMAL(10, 2), nullable=False)  

    order = relationship("Order", back_populates="items")
    book = relationship("Book", back_populates="order_items")


class DeliveryStatusEnum(str, enum.Enum):
    processing = "processing"
    in_transit = "in-transit"
    delivered = "delivered"

class DeliveryStatus(Base):
    _tablename_ = "DeliveryStatuses" 

    delivery_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("Orders.order_id"))
    status = Column(Enum(DeliveryStatusEnum), default=DeliveryStatusEnum.processing)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    order = relationship("Order", back_populates="delivery_status")


class Cart(Base):
    _tablename_ = "Cart" 

    cart_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"))

    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart")


class CartItem(Base):
    _tablename_ = "CartItems" 

    cart_id = Column(Integer, ForeignKey("Cart.cart_id"), primary_key=True)
    book_id = Column(Integer, ForeignKey("Books.book_id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)  

    cart = relationship("Cart", back_populates="items")
    book = relationship("Book", back_populates="cart_items")

class Review(Base):
    _tablename_ = "Reviews" 

    review_id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("Books.book_id"))
    user_id = Column(Integer, ForeignKey("Users.user_id"))
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    approval_status = Column(Boolean, default=False)

    user = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")


class Wishlist(Base):
    _tablename_ = "Wishlist" 

    user_id = Column(Integer, ForeignKey("Users.user_id"), primary_key=True)
    book_id = Column(Integer, ForeignKey("Books.book_id"), primary_key=True)

    user = relationship("User", back_populates="wishlist")
    book = relationship("Book", back_populates="wishlist_items")


class Invoice(Base):
    _tablename_ = "Invoices" 

    invoice_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("Orders.order_id"))
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    total_price = Column(DECIMAL(10, 2), nullable=False)
    pdf_path = Column(String(255))

    order = relationship("Order", back_populates="invoice")

class Discount(Base):
    _tablename_ = "Discounts" 

    discount_id = Column(Integer, primary_key=True, index=True)
    discount_name = Column(String(100), nullable=False)
    discount_rate = Column(DECIMAL(5, 2), nullable=False) 
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    book_discounts = relationship("BookDiscount", back_populates="discount")


class BookDiscount(Base):
    _tablename_ = "BookDiscounts" 

    book_id = Column(Integer, ForeignKey("Books.book_id"), primary_key=True)
    discount_id = Column(Integer, ForeignKey("Discounts.discount_id"), primary_key=True)

    book = relationship("Book", back_populates="discounts")
    discount = relationship("Discount", back_populates="book_discounts")



