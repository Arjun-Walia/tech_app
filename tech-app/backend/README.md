# Natively Backend API

A comprehensive RESTful API backend for the Natively tech learning application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **User Management**: Profile management, preferences, progress tracking
- **Assessments**: Create, take, and grade technical assessments
- **Learning Roadmaps**: Structured learning paths with progress tracking
- **Progress Analytics**: Detailed learning analytics and comparisons
- **Security**: Rate limiting, input validation, error handling
- **Scalable Architecture**: Modular design with proper separation of concerns

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs
- **Development**: Nodemon for auto-restart

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
```

### 3. Environment Variables
Configure the following variables in your `.env` file:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/natively-db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8081
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh JWT token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /verify-email` - Verify email address

#### User Routes (`/api/users`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /dashboard` - Get dashboard data
- `GET /progress` - Get learning progress
- `PUT /preferences` - Update preferences
- `DELETE /account` - Delete account

#### Assessment Routes (`/api/assessments`)
- `GET /` - Get all assessments
- `GET /:id/take` - Get assessment for taking
- `POST /:id/submit` - Submit assessment answers
- `GET /results` - Get user's assessment results
- `POST /` - Create assessment (Admin/Instructor)

#### Roadmap Routes (`/api/roadmaps`)
- `GET /` - Get all public roadmaps
- `GET /:id` - Get single roadmap
- `POST /:id/enroll` - Enroll in roadmap
- `POST /:id/progress` - Update progress
- `POST /:id/rate` - Rate roadmap
- `GET /user/enrolled` - Get enrolled roadmaps
- `POST /` - Create roadmap (Admin/Instructor)

#### Progress Routes (`/api/progress`)
- `GET /summary` - Get progress summary
- `GET /category/:category` - Get category-specific progress
- `GET /analytics` - Get learning analytics
- `GET /compare` - Compare with other users

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── models/           # Database models
│   │   ├── User.js       # User model
│   │   ├── Assessment.js # Assessment model
│   │   └── Roadmap.js    # Roadmap model
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── users.js      # User management routes
│   │   ├── assessments.js# Assessment routes
│   │   ├── roadmaps.js   # Roadmap routes
│   │   └── progress.js   # Progress tracking routes
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── errorHandler.js# Error handling middleware
│   └── server.js         # Main server file
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md            # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Comprehensive input validation
- **CORS Protection**: Configurable CORS policies
- **Helmet**: Security headers
- **Error Handling**: Secure error responses

## 🧪 API Testing

You can test the API using tools like:
- **Postman**: Import the collection (coming soon)
- **curl**: Command line testing
- **Thunder Client**: VS Code extension

### Example API Calls

#### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "Password123"
  }'
```

## 📊 Database Schema

### User Model
- Profile information
- Learning progress and XP
- Assessment results
- Enrolled roadmaps
- Preferences and settings

### Assessment Model
- Questions with multiple choice options
- Difficulty levels and categories
- Scoring and time limits
- Statistics tracking

### Roadmap Model
- Learning steps and prerequisites
- Technologies and projects
- Progress tracking
- Rating system

## 🚀 Deployment

### Environment Setup
```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natively-db
JWT_SECRET=your-production-secret
```

### Docker Deployment (Optional)
```dockerfile
# Create Dockerfile for containerization
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when available)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the [Issues](../../issues) section
- Create a new issue if needed
- Contact the development team

---

Built with ❤️ using Node.js and Express
