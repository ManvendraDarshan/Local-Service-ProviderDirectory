from database import SessionLocal, engine
from models import Base, User, Service
from auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Create admin user
admin = User(username="admin", email="admin@lspd.com", password_hash=get_password_hash("admin123"), role="admin", is_verified=True)
db.add(admin)

# Create provider
provider = User(username="provider", email="provider@lspd.com", password_hash=get_password_hash("provider123"), role="provider", is_verified=True)
db.add(provider)

# Create customer
customer = User(username="customer", email="customer@lspd.com", password_hash=get_password_hash("customer123"), role="customer", is_verified=True)
db.add(customer)

# Create services
services = [
    Service(provider_id=2, name="John's Plumbing", description="Expert plumbing services", category="Plumbing", location_lat=23.2599, location_lng=77.4126, address="Bhopal, MP", phone="1234567890", is_verified=True),
    Service(provider_id=2, name="Mary's Cleaning", description="Professional cleaning", category="Cleaning", location_lat=22.7196, location_lng=75.8577, address="Indore, MP", phone="0987654321", is_verified=False),
]

for service in services:
    db.add(service)

db.commit()
db.close()

print("Database seeded!")