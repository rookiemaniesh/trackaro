# Authentication Setup Guide

## Overview
Your Next.js frontend is now connected to your Express.js backend for authentication. Here's what has been configured:

## Backend Configuration
- **Port**: 5000 (default)
- **Authentication endpoints**:
  - `POST /api/auth/local/login` - User login
  - `POST /api/auth/local/register` - User registration
  - `GET /api/profile` - Get user profile
  - `PUT /api/profile` - Update user profile
  - `POST /api/auth/logout` - User logout

## Frontend Configuration
- **API URL**: `http://localhost:5000` (configurable via `NEXT_PUBLIC_API_URL`)
- **Authentication Context**: Updated to work with backend API
- **Login/Signup Pages**: Connected to backend endpoints

## How to Test

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The backend will start on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd pie-rates-pantheon25/frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`

### 3. Test Authentication
1. Navigate to `http://localhost:3000/auth/signup`
2. Create a new account with email and password
3. You should be redirected to `/chat` after successful registration
4. Try logging out and logging back in at `http://localhost:3000/auth/login`

## Environment Variables

### Frontend (.env.local)
Create a `.env.local` file in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
Make sure your backend `.env` file has the required variables:
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

## Features Implemented

### ✅ Completed
- [x] Backend authentication routes (login/register)
- [x] Frontend AuthContext updated for backend API
- [x] Login page connected to backend
- [x] Signup page connected to backend
- [x] JWT token management
- [x] Profile management
- [x] Google OAuth redirect (ready for backend OAuth setup)

### 🔄 Ready for Enhancement
- Google OAuth integration (backend routes exist)
- Password reset functionality
- Email verification
- Remember me functionality

## API Response Format

The backend returns responses in this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "profilePicture": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

## Error Handling

The frontend handles backend errors gracefully:
- Network errors
- Authentication failures
- Validation errors
- Server errors

All error messages from the backend are displayed to the user.

## Security Notes

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests
- CORS is configured for frontend-backend communication
- Passwords are hashed using bcryptjs on the backend

## Next Steps

1. Test the authentication flow
2. Set up Google OAuth if needed
3. Add password reset functionality
4. Implement email verification
5. Add user profile management features

