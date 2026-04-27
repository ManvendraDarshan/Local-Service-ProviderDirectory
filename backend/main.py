from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, Service, Review
from auth import authenticate_user, create_access_token, get_current_user, get_current_provider, get_current_admin, get_password_hash
from schemas import UserCreate, Token, ServiceCreate, Service as ServiceSchema, ReviewCreate, Review as ReviewSchema
from datetime import timedelta
from typing import List, Optional
from sqlalchemy import or_, func

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LSPD API", description="API for Local Service Provider Directory")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(or_(User.username == user.username, User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, password_hash=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
async def login(username: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/services", response_model=List[ServiceSchema])
async def get_services(
    category: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius: Optional[float] = 10,  # km
    db: Session = Depends(get_db)
):
    query = db.query(Service)
    if category:
        query = query.filter(Service.category.ilike(f"%{category}%"))
    if lat and lng and radius:
        # Simple distance calculation (not accurate for large distances)
        query = query.filter(
            func.sqrt(func.pow(Service.location_lat - lat, 2) + func.pow(Service.location_lng - lng, 2)) * 111 <= radius
        )
    return query.all()

@app.post("/services", response_model=ServiceSchema)
async def create_service(service: ServiceCreate, current_user: User = Depends(get_current_provider), db: Session = Depends(get_db)):
    db_service = Service(**service.dict(), provider_id=current_user.id)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.put("/services/{service_id}", response_model=ServiceSchema)
async def update_service(service_id: int, service: ServiceCreate, current_user: User = Depends(get_current_provider), db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id, Service.provider_id == current_user.id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in service.dict().items():
        setattr(db_service, key, value)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.post("/reviews", response_model=ReviewSchema)
async def create_review(review: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_review = Review(**review.dict(), user_id=current_user.id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/admin/services", response_model=List[ServiceSchema])
async def get_unverified_services(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Service).filter(Service.is_verified == False).all()

@app.put("/admin/services/{service_id}/verify")
async def verify_service(service_id: int, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    db_service.is_verified = True
    db.commit()
    return {"message": "Service verified"}

@app.get("/")
async def root():
    return {"message": "Welcome to LSPD API"}