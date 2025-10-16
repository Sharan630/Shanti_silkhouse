# Saree Website Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- Neon Database account
- Cloudinary account

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
The database connection is already configured in `server/config.env`. You just need to:

1. **Update JWT Secret**: Change the JWT_SECRET in `server/config.env` to a strong random string
2. **Add Cloudinary Credentials**: Replace the Cloudinary values in `server/config.env` with your actual credentials

Your Neon database is already configured:
```
DATABASE_URL=postgresql://neondb_owner:npg_aou72AyCpdRN@ep-dawn-forest-ad77y081-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. Database Setup
✅ **Your Neon database is already configured!** The database tables will be created automatically when you start the server.

### 4. Cloudinary Setup
1. Sign up for a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret from the Cloudinary dashboard
3. Replace the Cloudinary values in `server/config.env`

### 5. Create Admin User
Run this command to create an admin user:

```bash
node server/create-admin.js
```

This will create an admin user with:
- **Email**: admin@saree.com
- **Password**: admin123
- **Name**: Admin User

### 6. Start the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev
```

#### Frontend Only
```bash
npm start
```

#### Backend Only
```bash
npm run server
```

### 7. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## Features Implemented

### Backend Features
- ✅ Neon Database integration
- ✅ JWT-based authentication for users and admins
- ✅ User registration and login
- ✅ Admin authentication
- ✅ Product management (CRUD operations)
- ✅ Order management
- ✅ Cloudinary image upload integration
- ✅ RESTful API endpoints

### Frontend Features
- ✅ User authentication (login/register)
- ✅ Admin panel with product management
- ✅ Image upload functionality
- ✅ Order management
- ✅ Responsive design
- ✅ Authentication context

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/profile` - Get user profile

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get product categories

#### Admin
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

#### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image/:publicId` - Delete image

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected admin routes
- Input validation
- CORS configuration

## Next Steps
1. Set up your environment variables
2. Start the application
3. Create an admin user
4. Test the admin panel functionality
5. Add products through the admin panel
6. Test user registration and login
