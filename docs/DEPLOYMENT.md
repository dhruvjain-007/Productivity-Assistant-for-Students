# Deployment Guide

## Free Deployment Options

### Backend Deployment

#### Option 1: Render.com (Recommended)

1. **Prepare Backend**
```bash
cd backend
npm install
```

2. **Create Render Account**
   - Visit https://render.com
   - Sign up with GitHub

3. **Deploy**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Build Command: `npm install`
     - Start Command: `node src/server.js`
     - Environment Variables (add from .env):
       - `MONGODB_URI`: Your MongoDB connection string
       - `JWT_SECRET`: Your JWT secret
       - `OPENAI_API_KEY`: Your OpenAI key
       - `FRONTEND_URL`: Your frontend URL

4. **Deploy** and get your backend URL

#### Option 2: Railway.app

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

#### Option 3: Heroku (requires credit card)

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Database Deployment

#### MongoDB Atlas (Free Tier)

1. **Create Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up

2. **Create Cluster**
   - Click "Create" for a new cluster
   - Select M0 (Free) tier
   - Choose region close to you

3. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string

4. **Create Database User**
   - Go to "Database Access"
   - Add new user with password
   - Update connection string with credentials

5. **Allow IP Address**
   - Go to "Network Access"
   - Add IP address (or allow all 0.0.0.0/0 for development)

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. **Prepare Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
   - Visit https://vercel.com
   - Connect GitHub
   - Import your repository
   - Configure:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Environment Variables:
       - `REACT_APP_API_URL`: Your backend URL (e.g., https://your-backend.onrender.com/api)

3. **Deploy** - Automatic on push to main

#### Option 2: Netlify

1. **Build Frontend**
```bash
npm run build
```

2. **Deploy to Netlify**
   - Visit https://netlify.com
   - Drag and drop `frontend/build` folder
   - Or connect GitHub for automatic deployments

3. **Configure Environment Variables**
   - Go to Site settings → Build & deploy
   - Add `REACT_APP_API_URL` environment variable

#### Option 3: GitHub Pages (Static hosting only)

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/Productivity-Assistant"

# Deploy
npm run build
npm install gh-pages
npx gh-pages -d build
```

### Full Stack Deployment (Complete Guide)

#### Step 1: Set Up Backend

**Using Render.com:**

```yaml
# render.yaml (add to root of backend folder)
services:
  - type: web
    name: productivity-assistant-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node src/server.js
    envVars:
      - key: MONGODB_URI
        scope: all
        value: ${MONGODB_URI}
      - key: JWT_SECRET
        scope: all
        value: ${JWT_SECRET}
      - key: OPENAI_API_KEY
        scope: all
        value: ${OPENAI_API_KEY}
      - key: FRONTEND_URL
        scope: all
        value: ${FRONTEND_URL}
```

#### Step 2: Set Up Database

1. Create MongoDB Atlas cluster
2. Create database user
3. Allow network access
4. Get connection string

#### Step 3: Configure API Keys

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Add to environment variables

#### Step 4: Deploy Frontend

1. Update `REACT_APP_API_URL` to your backend URL
2. Deploy to Vercel/Netlify

#### Step 5: Update CORS

Update backend `.env`:
```
FRONTEND_URL=https://your-frontend-domain.com
```

### Environment Variables Checklist

**Backend (.env)**
```
✓ MONGODB_URI - MongoDB connection string
✓ JWT_SECRET - Random secure string (min 32 chars)
✓ OPENAI_API_KEY - Your OpenAI API key
✓ FRONTEND_URL - Your frontend domain
✓ PORT - Usually 5000
✓ NODE_ENV - production
```

**Frontend (.env)**
```
✓ REACT_APP_API_URL - Backend URL with /api
```

### Monitoring & Debugging

#### View Logs

**Render:**
```
Dashboard → Your App → Logs
```

**Railway:**
```
Click app → Deployments → View logs
```

#### Common Issues

1. **CORS Errors**
   - Update `FRONTEND_URL` in backend
   - Ensure it matches exactly

2. **API Not Found**
   - Check `REACT_APP_API_URL` includes `/api`
   - Verify backend is running

3. **Database Connection**
   - Add your deployment IP to MongoDB Atlas
   - Check connection string format

4. **OpenAI API Errors**
   - Verify API key is valid
   - Check account has credits
   - Ensure model name is correct

### Performance Tips

1. **Enable Gzip Compression**
```javascript
// backend/src/server.js
app.use(compression());
```

2. **Database Indexing**
   - Already included in models
   - Monitor query performance

3. **CDN for Static Files**
   - Vercel/Netlify automatically use CDN
   - No additional configuration needed

4. **API Response Caching**
   - Add caching headers in controllers
   - Use Redis for session caching (optional)

### Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] Environment variables are not committed
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Helmet security headers enabled
- [ ] HTTPS is enforced
- [ ] Database password is strong
- [ ] OpenAI API key is restricted (if available)

### Cost Analysis

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Render | ✓ | 750 free compute hours/month |
| Vercel | ✓ | 100GB bandwidth/month |
| Netlify | ✓ | 300 build minutes/month |
| MongoDB Atlas | ✓ | 512MB storage |
| OpenAI | ✗ | Pay per token (~$5 starter credit) |

### Scaling for Production

When ready to scale:

1. **Upgrade Database Tier** on MongoDB Atlas
2. **Use Paid Tier** on Render/Vercel for better performance
3. **Enable CDN** for static assets
4. **Add Redis** for caching
5. **Implement Rate Limiting** per user
6. **Set up Monitoring** with Sentry
7. **Enable Backups** for database

### Rollback Strategy

**If deployment fails:**

```bash
# Render - Automatic rollback available in dashboard
# Vercel - Switch to previous production deployment
# GitHub - Revert commits and redeploy
```

### Custom Domain Setup

1. **Buy Domain** (Namecheap, GoDaddy, etc.)
2. **Update DNS Records**
   - Point to Vercel/Render nameservers
   - Or add CNAME records directly

3. **Enable HTTPS**
   - Automatic with Vercel/Netlify
   - Render provides free SSL

---

**Deployment should take ~15-20 minutes to complete**

For questions, check provider documentation or create an issue on GitHub.
