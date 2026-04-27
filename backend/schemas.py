from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str
    role: Optional[str] = "customer"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_verified: bool
    location_lat: Optional[float]
    location_lng: Optional[float]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ServiceBase(BaseModel):
    name: str
    description: str
    category: str
    location_lat: float
    location_lng: float
    address: str
    phone: str

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    provider_id: int
    is_verified: bool

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    service_id: int
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True