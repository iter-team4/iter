# Iter

A full-stack MERN web application for creating, saving, and analyzing running routes. Users can design custom routes on an interactive map, track completed runs, view historical statistics, and manage their personal running data through a modern, responsive interface.

---

## Features

### Route Planning

- Create custom walking/running routes using an interactive Leaflet map
- Automatic route generation using OpenRouteService
- Calculate total route distance
- Save custom routes to your account
- Search previously saved routes
- Delete saved routes

### Run History

- View completed runs on a calendar
- Inspect historical routes
- Track distance, duration, and pace
- Browse runs by date

### User Profiles

- JWT-based authentication
- Personalized user profiles
- Running statistics
- Member since information
- Secure sign out

### Security

- Manual JWT authentication
- Access token expiration
- Token refresh support
- JWT decoding and validation
- Multi-factor authentication (MFA)
- Email verification using SendGrid

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet
- React Leaflet
- Radix UI
- Vitest

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- SendGrid

## Infrastructure

### Current

- MongoDB Atlas
- AWS Amplify (Frontend)
- AWS EC2 (Backend deployment)
- Nginx Reverse Proxy
- PM2 Process Manager

> **Note:** The backend is currently being migrated from AWS Lambda + API Gateway (Serverless Express) to a dedicated AWS EC2 deployment to provide lower latency, simplified deployment, and greater scalability.

---

# Authentication

Iter uses a custom authentication system built with JSON Web Tokens (JWT).

Authentication flow:

1. User registers an account.
2. Email verification code is sent using SendGrid.
3. User verifies their account with MFA.
4. Backend issues a signed JWT access token.
5. Access tokens include expiration timestamps.
6. Expired tokens can be refreshed securely.
7. Protected API routes validate JWTs before processing requests.

The project previously used **Amazon Cognito**, but authentication has been fully migrated to a custom JWT implementation to provide greater flexibility and simplify infrastructure.

---

# Architecture

```
React + Vite
      │
      ▼
Express API
      │
      ▼
 MongoDB Atlas
```

External Services

- OpenRouteService
- SendGrid
- AWS EC2
- AWS Amplify

---

# Project Structure

```
frontend/
├── src/
|   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
|   ├── lib/
|   ├── layouts/
|   ├── styles/
|   ├── types/
│   ├── constants/
│   └── test/

backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
|   ├── types/
│   ├── utils/
│   ├── app.ts
|   ├── index.ts
|   └── lambda.ts
```

---

# Testing

Frontend and Backend tests are written using **Vitest**.

Current testing includes:

- Authentication utilities
- Calendar logic
- Running statistics calculations
- Utility functions

Backend tests cover:

- Authentication controllers
- User controllers
- Route controllers
- Error handling

---

# Security

- Password hashing
- JWT signing and verification
- Access token expiration
- Token refresh workflow
- Protected API middleware
- Email-based MFA
- Environment variable configuration
- Server-side input validation

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/iter-team4/iter.git
cd iter
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run dev
```

---

# Environment Variables

### Backend

```env
PORT=
MONGO_URI=

JWT_SECRET=

SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

FRONTEND_URL=

OPENROUTESERVICE_API_KEY=
```

### Frontend

```env
VITE_API_URL=
```

---

# License

This project is intended for educational and portfolio purposes.
