# Deployment Guide: Railway

## Step-by-Step Deployment to Railway

### Prerequisites
- GitHub account (free)
- Railway account (free tier available)
- MongoDB Atlas account (free tier available)

---

## Step 1: Set Up Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Create account and verify email

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Choose cloud provider (AWS/Google Cloud/Azure) - any is fine
4. Choose region (pick closest to you)
5. Click "Create"

### 1.3 Set Up Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `maaser-admin`
4. Password: Create a strong password (save this!)
5. Role: "Read and write to any database"
6. Click "Add User"

### 1.4 Set Up Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for now)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `maaser-tracker`

**Example connection string:**
```
mongodb+srv://maaser-admin:yourpassword@cluster0.xxxxx.mongodb.net/maaser-tracker?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Connect GitHub to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"

### 2.2 Deploy Backend
1. Select your `maaser-tracker` repository
2. Railway will detect it's a Node.js app
3. Set the root directory to `backend`
4. Click "Deploy"

### 2.3 Configure Environment Variables
In Railway dashboard, go to your backend service and add these variables:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://maaser-admin:yourpassword@cluster0.xxxxx.mongodb.net/maaser-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
FRONTEND_URL=https://your-frontend-url.railway.app
```

### 2.4 Get Backend URL
1. Railway will give you a URL like: `https://your-app-name.railway.app`
2. Save this URL - you'll need it for the frontend

---

## Step 3: Deploy Frontend to Railway

### 3.1 Create Frontend Service
1. In Railway dashboard, click "New Service"
2. Choose "Deploy from GitHub repo"
3. Select same repository
4. Set root directory to `frontend`

### 3.2 Configure Frontend Build
Railway will automatically:
- Install dependencies
- Run `npm run build`
- Serve the built files

### 3.3 Set Frontend Environment Variable
Add this variable to your frontend service:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 3.4 Get Frontend URL
Railway will give you a URL like: `https://your-frontend-name.railway.app`

---

## Step 4: Update Backend CORS

Go back to your backend service in Railway and update:
```
FRONTEND_URL=https://your-frontend-url.railway.app
```

---

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try to register a new account
3. Try to log in
4. Add some income/tzedaka data
5. Check if everything works

---

## Troubleshooting

### Common Issues:

**1. "Cannot connect to database"**
- Check your MongoDB connection string
- Make sure password is correct
- Verify network access allows all IPs

**2. "CORS error"**
- Check that FRONTEND_URL in backend matches your frontend URL exactly
- Make sure both URLs use HTTPS

**3. "Environment variable not found"**
- Check that all environment variables are set in Railway
- Make sure there are no typos

**4. "Build failed"**
- Check Railway logs for specific errors
- Make sure all dependencies are in package.json

---

## Cost Breakdown

### Railway (Free Tier):
- **Backend:** Free (limited usage)
- **Frontend:** Free (limited usage)
- **Total:** $0/month

### Railway (Paid):
- **Backend:** $5-20/month
- **Frontend:** $5-20/month
- **Total:** $10-40/month

### MongoDB Atlas:
- **Free tier:** $0/month (512MB storage)
- **Paid:** $9/month (2GB storage)

---

## Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure monitoring** (Railway provides basic monitoring)
3. **Set up backups** (MongoDB Atlas has automatic backups)
4. **Add SSL certificate** (Railway provides this automatically)

---

## Alternative Platforms

If Railway doesn't work for you:

### Render (Similar to Railway):
- Free tier available
- Easy setup
- Good documentation

### Heroku:
- More expensive ($7-25/month)
- Very reliable
- Great for scaling

### DigitalOcean:
- $5-12/month
- More control
- Good performance 