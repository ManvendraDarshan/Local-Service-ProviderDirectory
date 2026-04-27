# LSPD - Local Service Provider Directory

A digital Yellow Pages for Madhya Pradesh to connect users with trusted local service providers.

## Features

- User registration and login (Customers, Service Providers, Admins)
- Location-based search for services (electricians, plumbers, etc.)
- Map integration (Google Maps or Leaflet)
- Rating and review system
- Verified badge for trusted providers
- Admin panel for managing users and verifications

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL

## Project Structure

```
LSPD/
├── frontend/          # React application
├── backend/           # FastAPI application
│   ├── main.py        # Main FastAPI app
│   ├── requirements.txt
│   └── venv/          # Python virtual environment
├── .vscode/           # VS Code configuration
│   └── tasks.json     # Dev server tasks
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL (for database)

### Installation

1. **Clone or navigate to the project directory**

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Database Setup**
   - Install PostgreSQL
   - Create a database named `lspd`
   - Update database connection in `backend/main.py` or add environment variables

### Running the Application

#### Using VS Code Tasks (Recommended)
- Open the project in VS Code
- Press `Ctrl+Shift+P` and select "Tasks: Run Task"
- Run "Run Frontend" to start React dev server on http://localhost:5173
- Run "Run Backend" to start FastAPI server on http://localhost:8000

#### Manual Commands

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
uvicorn main:app --reload
```

### API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

## Development

- Frontend: React components, routing, map integration
- Backend: REST API endpoints, authentication, database models
- Database: SQLAlchemy ORM for PostgreSQL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is open source. Feel free to use and modify.