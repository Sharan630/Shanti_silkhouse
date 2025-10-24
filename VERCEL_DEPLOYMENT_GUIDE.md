# Vercel Deployment Guide for Sarees E-commerce Website

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Database**: PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
4. **Cloudinary Account**: For image storage and management

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Project Structure
Ensure your project has these files:
- `vercel.json` ✅
- `api/` directory with serverless functions ✅
- `package.json` with correct scripts ✅
- `build/` directory (will be created during build)

## Step 2: Set Up External Services

### 2.1 Database Setup (Neon - Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Note: Your current database URL is already configured

### 2.2 Cloudinary Setup
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select your repository and click "Import"

### 3.2 Configure Project Settings
1. **Project Name**: `sarees-ecommerce` (or your preferred name)
2. **Framework Preset**: Other (or React if detected)
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`

### 3.3 Set Environment Variables
In the Vercel dashboard, go to Settings > Environment Variables and add:

```
DATABASE_URL = postgresql://neondb_owner:npg_Mh6e0LJdKRVG@ep-fancy-sound-aduoapzf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&application_name=ecommerce_app

JWT_SECRET = kenevkjenvkjnkjfvnwjknkjvnjwen

CLOUDINARY_CLOUD_NAME = dwmzvcrol

CLOUDINARY_API_KEY = 748945727958998

CLOUDINARY_API_SECRET = Hzb73zhlT4D4vaWgLOty6x6pJfc

NODE_ENV = production
```

### 3.4 Deploy
1. Click "Deploy" button
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be available at `https://your-project-name.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Test Your API Endpoints
Test these endpoints to ensure everything works:
- `GET https://your-domain.vercel.app/api/health`
- `GET https://your-domain.vercel.app/api/products`
- `POST https://your-domain.vercel.app/api/auth/register`

### 4.2 Update Frontend API URLs
If your frontend is making API calls to localhost, update them to use your Vercel domain:

```javascript
// In your React components, update API calls from:
const API_URL = 'http://localhost:5000/api';

// To:
const API_URL = 'https://your-domain.vercel.app/api';
```

### 4.3 Create Admin User
You'll need to create an admin user in your database. You can do this by:
1. Using a database client (pgAdmin, DBeaver, etc.)
2. Running the SQL command to insert an admin user
3. Or creating a temporary API endpoint to create admin users

## Step 5: Domain Configuration (Optional)

### 5.1 Custom Domain
1. In Vercel dashboard, go to your project
2. Click on "Domains" tab
3. Add your custom domain
4. Follow the DNS configuration instructions

### 5.2 SSL Certificate
Vercel automatically provides SSL certificates for all domains.

## Step 6: Monitoring and Maintenance

### 6.1 Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and usage

### 6.2 Database Monitoring
- Monitor your database usage
- Set up alerts for connection limits

### 6.3 Error Monitoring
- Check Vercel function logs for any errors
- Monitor API response times

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (18+)

2. **API Errors**
   - Verify environment variables are set correctly
   - Check database connection string
   - Review function logs in Vercel dashboard

3. **Database Connection Issues**
   - Ensure DATABASE_URL is correct
   - Check if database allows connections from Vercel IPs
   - Verify SSL settings

4. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS settings

### Getting Help:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## File Structure After Deployment

```
your-project/
├── api/                    # Serverless functions
│   ├── index.js           # Main API handler
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product management
│   ├── admin.js           # Admin panel routes
│   ├── upload.js          # Image upload
│   ├── cart.js            # Shopping cart
│   ├── database.js        # Database connection
│   └── middleware.js      # Auth middleware
├── build/                 # Built React app
├── public/                # Static assets
├── src/                   # React source code
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
└── env.example           # Environment variables template
```

## Security Notes

1. **Environment Variables**: Never commit sensitive data to your repository
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **Database**: Use connection pooling and proper SSL
4. **API Keys**: Rotate API keys regularly
5. **CORS**: Configure CORS properly for production domains

## Performance Optimization

1. **Image Optimization**: Vercel automatically optimizes images
2. **CDN**: Vercel provides global CDN
3. **Caching**: Implement proper caching strategies
4. **Database**: Use connection pooling and query optimization

Your sarees e-commerce website should now be successfully deployed on Vercel! 🎉