# Forward School - NitroDegree in Applied Software Engineering - Back End Web Development Competency Unit 6: Case Study

## Prerequisites

- Node.js installed
- MongoDB installed and running locally

## Setup Instructions

### Backend
1. Navigate to the backend folder:
```bash
   cd backend
```
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file based on `.env.example` and fill in your values.
   macOS users: set PORT to something other than 5000 if AirPlay is using it.
   
4. Seed the database:
```bash
   node seedProducts.js
```
5. Start the server:
```bash
   node index.js
```

### Frontend
1. Navigate to the frontend folder:
```bash
   cd frontend
```
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file based on `.env.example` and fill in your values
4. Start the frontend:
```bash
   npm run dev
```

## Features
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes with JWT middleware
- Full product CRUD operations
- Token validation and auto-redirect to login
