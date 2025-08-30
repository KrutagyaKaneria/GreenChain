# 🌱 GreenChain - Sustainable Hydrogen Credit Trading Platform

A complete, production-ready authentication and authorization module for the GreenChain platform, built with React, Node.js, Express, MongoDB, and Nodemailer.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control (RBAC)** with 5 distinct roles:
  - **Admin**: Full system owner and super-user
  - **Producer**: Green hydrogen facility operator
  - **Verifier**: Certification body or auditor
  - **Buyer**: Industrial consumer
  - **Regulator**: Government authority or policy-maker

- **Secure Authentication Flow**:
  - Email OTP verification on signup (4-digit code, 10-minute expiry)
  - JWT-based authentication with HTTP-only secure cookies
  - Password reset via secure email links
  - Account status verification

### 🛡️ Security Features
- **Helmet.js** for security headers
- **CORS** configured for frontend URL
- **Rate limiting** to prevent abuse
- **bcrypt** password hashing
- **Input validation** with express-validator
- **JWT token management** with automatic refresh
- **Secure cookie configuration**

### 📧 Email Services
- **Professional HTML templates** for OTP and password reset
- **Nodemailer integration** with Gmail support
- **Automatic email verification** workflow
- **Resend OTP functionality**

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Form validation** with Formik and Yup
- **Loading states** and user feedback
- **Professional styling** with custom animations
- **Mobile-first approach**

## 🏗️ Architecture

```
GreenChain/
├── 📁 Backend (Node.js + Express)
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── routes/          # API endpoints
│   ├── services/        # Email service
│   └── server.js        # Main server
├── 📁 Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── contexts/    # Auth context
│   │   └── App.jsx      # Main app
│   └── package.json
├── 📁 Docker
│   ├── Dockerfile       # Production build
│   └── docker-compose.yml
└── 📁 Configuration
    ├── .env.example     # Environment variables
    └── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+
- Docker & Docker Compose (optional)

### 1. Clone and Install
```bash
git clone <repository-url>
cd GreenChain

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration
```bash
# Copy environment file
cp env.example .env

# Edit .env with your values
nano .env
```

**Required Environment Variables:**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/greenchain

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3. Start Development Servers
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🐳 Docker Deployment

### Quick Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build
```bash
# Build production image
docker build -t greenchain:latest .

# Run container
docker run -p 5000:5000 --env-file .env greenchain:latest
```

## 📚 API Endpoints

### Authentication Routes
```
POST   /api/auth/signup           # User registration
POST   /api/auth/verify-otp       # OTP verification
POST   /api/auth/login            # User login
POST   /api/auth/logout           # User logout
POST   /api/auth/forgot-password  # Password reset request
POST   /api/auth/reset-password/:token # Password reset
POST   /api/auth/resend-otp       # Resend OTP
GET    /api/auth/profile          # Get user profile
PUT    /api/auth/profile          # Update user profile
```

### Protected Routes
```
GET    /api/protected             # Test protected endpoint
```

## 🔐 Role Permissions

### Admin
- Full system access
- User and role management
- System configuration
- Smart contract deployment

### Producer
- Facility management
- IoT sensor registration
- Production metrics
- Credit issuance

### Verifier
- Credit verification
- Certification reports
- Compliance auditing
- Pending request access

### Buyer
- Credit browsing
- Purchase transactions
- Purchase history
- Compliance reporting

### Regulator
- System-wide monitoring
- Transaction audit trails
- Compliance enforcement
- Regulatory reports

## 🛠️ Development

### Backend Development
```bash
# Run with nodemon
npm run dev

# Run tests
npm test

# Production build
npm start
```

### Frontend Development
```bash
cd client

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Database Management
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/greenchain"

# View collections
show collections

# Query users
db.users.find()
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "auth"
```

### Frontend Tests
```bash
cd client

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Production Deployment

### Environment Setup
1. **Set production environment variables**
2. **Configure MongoDB with authentication**
3. **Set up SSL certificates**
4. **Configure reverse proxy (Nginx)**
5. **Set up monitoring and logging**

### Security Checklist
- [ ] Change default JWT secret
- [ ] Configure HTTPS
- [ ] Set up rate limiting
- [ ] Enable CORS restrictions
- [ ] Configure secure cookies
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Configure email service

### Performance Optimization
- [ ] Enable MongoDB indexing
- [ ] Implement Redis caching
- [ ] Set up CDN for static assets
- [ ] Configure compression
- [ ] Enable HTTP/2

## 🔍 Troubleshooting

### Common Issues

**Email not sending:**
- Check Gmail app password
- Verify email service configuration
- Check firewall/network settings

**MongoDB connection failed:**
- Verify MongoDB is running
- Check connection string
- Verify authentication credentials

**JWT token issues:**
- Check JWT secret configuration
- Verify token expiration settings
- Check cookie configuration

**Frontend build errors:**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify Vite configuration

## 📈 Monitoring & Logging

### Application Logs
```bash
# View application logs
docker-compose logs -f api

# View MongoDB logs
docker-compose logs -f mongodb
```

### Health Checks
```bash
# API health
curl http://localhost:5000/api/health

# Database connection
curl http://localhost:5000/api/auth/profile
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🔮 Roadmap

- [ ] Multi-factor authentication
- [ ] OAuth integration
- [ ] Advanced role permissions
- [ ] Audit logging system
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Blockchain integration
- [ ] Advanced analytics

---

**Built with ❤️ for a sustainable future**

