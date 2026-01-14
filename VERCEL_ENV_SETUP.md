# Environment Variables for Vercel Deployment

## Frontend Environment Variables

Add these in **Vercel Dashboard → Project Settings → Environment Variables**

### Required Variables

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

> **IMPORTANT:** 
> - Replace `your-backend-url.railway.app` with your actual Railway backend URL
> - The URL should end with `/api` (the API base path)
> - After adding/changing environment variables, you MUST click "Redeploy" in Vercel

### Optional Variables

```
NODE_ENV=production
```

---

## How to Find Your Railway Backend URL

1. Go to Railway Dashboard
2. Open your backend project
3. Click on "Settings" → "Domains"
4. Copy the generated domain (e.g., `mediconnect-backend-production.up.railway.app`)
5. Add `/api` to the end: `https://mediconnect-backend-production.up.railway.app/api`

---

## Backend Environment Variables (Railway)

These should already be set in Railway, but verify:

```
CLIENT_URL=https://mediconnect25.vercel.app
MONGODB_URI=<your-mongodb-atlas-connection-string>
REDIS_URL=<your-upstash-redis-url>
RABBITMQ_URL=<your-cloudamqp-url>
JWT_SECRET=<your-secret-key>
PORT=5000
NODE_ENV=production
```

---

## Verification Steps

After setting environment variables:

1. **Redeploy on Vercel** (this is critical!)
2. Open https://mediconnect25.vercel.app/
3. Open Browser Console (F12)
4. You should see:
   ```
   🚀 MediConnect App Starting...
   🔧 API Configuration:
     - VITE_API_URL: https://your-backend-url.railway.app/api
     - Using API Base URL: https://your-backend-url.railway.app/api
   ✅ Root element found, creating React root...
   ✅ React app mounted successfully
   ```

If you see `VITE_API_URL: (not set)`, the environment variable was not configured correctly.
