# Deployment Guide: MediConnect

To deploy this website for production, you need to move your remaining local services (MongoDB and Redis) to the cloud and host your code.

---

## 1. Cloud Services Setup (Free Tiers)

Before deploying the code, set up these production-ready databases:

| Service | Provider | Why? |
| :--- | :--- | :--- |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/general/tryfree) | Official cloud MongoDB. Very stable. |
| **Redis** | [Upstash](https://upstash.com/) | Serverless Redis, perfect for production. |
| **RabbitMQ** | [CloudAMQP](https://www.cloudamqp.com/) | **(Already Done! ✅)** |

---

## 2. Backend Deployment (Node.js)

**Recommended Platform**: [Render](https://render.com/) or [Railway](https://railway.app/)

### Steps:
1.  Push your code to a **GitHub Repository**.
2.  Connect your repo to Render/Railway as a "Web Service".
3.  **Environment Variables**: Copy all variables from your local `.env` to the platform's Dashboard.
    - Update `MONGODB_URI` with your Atlas connection string.
    - Update `REDIS_URL` with your Upstash URL.
    - Update `CLIENT_URL` to your future frontend URL (e.g., `https://my-mediconnect.vercel.app`).
4.  **Backend Task**: Since you have workers, make sure they start (we already call them in `server.js`, so it should work automatically on most platforms).

---

## 3. Frontend Deployment (React)

**Recommended Platform**: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)

### Steps:
1.  Connect your GitHub repo to Vercel.
2.  Set the **Build Command**: `npm run build`
3.  Set the **Output Directory**: `dist` (if Vite) or `build` (if CRA).
4.  **Environment Variables**:
    - `VITE_API_URL`: Set this to your **Backend URL** from Render.
5.  Deploy!

---

## 4. Production Checklist

> [!IMPORTANT]
> - **CORS**: Ensure your Backend's `CLIENT_URL` matches your Frontend's domain.
> - **Security**: Use `helmet` and `express-rate-limit` (already included in your code).
> - **Environment**: Set `NODE_ENV=production`.
