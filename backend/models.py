from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="customer")  # customer, provider, admin
    is_verified = Column(Boolean, default=False)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    location_lat = Column(Float)
    location_lng = Column(Float)
    address = Column(String)
    phone = Column(String)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    provider = relationship("User")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    rating = Column(Integer)  # 1-5
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    service = relationship("Service")