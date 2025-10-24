# Troubleshooting Vercel Deployment Issues

## Issue: Blank White Page After Deployment

### Quick Fixes to Try:

1. **Check API Endpoints**
   - Test: `https://your-domain.vercel.app/api/test`
   - Test: `https://your-domain.vercel.app/api/health`
   - Test: `https://your-domain.vercel.app/api/test/db`

2. **Verify Environment Variables**
   Make sure these are set in Vercel dashboard:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NODE_ENV=production
   ```

3. **Check Build Logs**
   - Go to Vercel dashboard → Your project → Functions tab
   - Look for any error messages in the build logs

### Common Issues and Solutions:

#### 1. API Routes Not Working
**Symptoms:** Frontend loads but API calls fail
**Solution:** 
- Check if environment variables are set correctly
- Verify database connection string
- Test API endpoints directly in browser

#### 2. Frontend Not Loading
**Symptoms:** Completely blank page
**Solution:**
- Check if `build` directory exists and has content
- Verify `vercel.json` configuration
- Check browser console for JavaScript errors

#### 3. Database Connection Issues
**Symptoms:** API returns 500 errors
**Solution:**
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel
- Test database connection with `/api/test/db` endpoint

#### 4. Environment Variables Not Set
**Symptoms:** API calls fail with undefined errors
**Solution:**
- Set all required environment variables in Vercel dashboard
- Redeploy after setting variables

### Debugging Steps:

1. **Test API Endpoints:**
   ```bash
   # Test basic API
   curl https://your-domain.vercel.app/api/health
   
   # Test database connection
   curl https://your-domain.vercel.app/api/test/db
   ```

2. **Check Browser Console:**
   - Open browser developer tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Check Vercel Logs:**
   - Go to Vercel dashboard
   - Click on your project
   - Go to Functions tab
   - Check for error logs

### Files to Check:

1. **vercel.json** - Configuration file
2. **api/index.js** - Main API handler
3. **src/contexts/AuthContext.js** - API base URL configuration
4. **Environment variables** - In Vercel dashboard

### Quick Commands:

```bash
# Build locally to test
npm run build

# Test build locally
npx serve -s build

# Check if all files are present
ls -la api/
ls -la build/
```

### If Still Not Working:

1. **Redeploy:**
   - Push changes to GitHub
   - Vercel will automatically redeploy

2. **Check Vercel Function Logs:**
   - Go to Vercel dashboard
   - Click on your project
   - Go to Functions tab
   - Look for error messages

3. **Test Database Connection:**
   - Use the `/api/test/db` endpoint
   - Check if DATABASE_URL is correct

4. **Verify Environment Variables:**
   - All required variables should be set
   - No typos in variable names
   - Values should be correct

### Contact Support:
If issues persist, check:
- Vercel documentation: https://vercel.com/docs
- Vercel community: https://github.com/vercel/vercel/discussions
