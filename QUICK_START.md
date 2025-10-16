# 🚀 Quick Start Guide - Saree Website

## Your Neon Database is Ready! ✅

Your Neon database connection is already configured:
```
postgresql://neondb_owner:npg_aou72AyCpdRN@ep-dawn-forest-ad77y081-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for testing)
The database is ready, but you'll need Cloudinary for image uploads:

1. **Get Cloudinary credentials** from https://cloudinary.com
2. **Update `server/config.env`** with your Cloudinary details:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key  
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 3. Create Admin User
```bash
node server/create-admin.js
```
This creates an admin with:
- **Email**: admin@saree.com
- **Password**: admin123

### 4. Start the Application
```bash
npm run dev
```

### 5. Access Your Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:5000

## What's Already Working

✅ **Database**: Neon PostgreSQL connection configured  
✅ **Authentication**: User login/register system  
✅ **Admin Panel**: Product and order management  
✅ **Image Upload**: Cloudinary integration  
✅ **API**: Complete REST API with 15+ endpoints  

## Test the System

1. **Visit the website**: http://localhost:3000
2. **Register a user account** (click user icon in header)
3. **Login to admin panel**: http://localhost:3000/admin
   - Email: admin@saree.com
   - Password: admin123
4. **Add products** with images in the admin panel
5. **Test user registration** and login

## Features Available

### For Users
- User registration and login
- Browse products (when you add them)
- Shopping cart functionality
- Order management

### For Admins
- Product management (add, edit, delete)
- Image upload with Cloudinary
- Order management
- User management

## Troubleshooting

**Database connection issues?**
- Your Neon database is already configured
- Tables will be created automatically on first run

**Image upload not working?**
- Make sure you've added your Cloudinary credentials to `server/config.env`

**Admin login not working?**
- Run `node server/create-admin.js` to create the admin user

## Next Steps

1. Add your Cloudinary credentials
2. Start the application
3. Create an admin user
4. Add some products through the admin panel
5. Test the complete user flow

Your Neon database integration is complete and ready to use! 🎉
