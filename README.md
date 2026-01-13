# Online Health Center

A comprehensive healthcare management system connecting patients, doctors, pharmacists, and administrators.

## Project Structure

- **Backend**: Node.js/Express server with MongoDB.
- **Frontend**: React application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a cloud URI)
- Redis (optional, for caching/sessions)

## Getting Started

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/online-hc
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm start
```

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the React application:
```bash
npm run dev
```

The application will open at `http://localhost:3000`.

## Features implemented

- **Patient Portal**: Appointment booking, medical history, prescriptions.
- **Doctor Portal**: Schedule management, patient records, consultations.
- **Pharmacy Portal**: Inventory, order management.
- **Admin Portal**: User management, analytics, system reports.
