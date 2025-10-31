# Deployment Guide - Global Airports Application

## Overview

This guide provides instructions for deploying the Global Airports Weather & Location application to production hosting platforms.

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

Render offers a free tier perfect for this application, with automatic deployments from GitHub.

#### Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Git repository with your code

#### Deployment Steps

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Sign up/Login to Render**
   - Visit https://render.com
   - Click "Get Started" or "Sign In"
   - Connect your GitHub account

3. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `bertintshisuaka2/Global-Airport`
   - Grant Render access to the repository

4. **Configure the Service**
   - **Name**: `global-airports` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Free

5. **Set Environment Variables**
   Add these environment variables in the Render dashboard:
   
   ```
   NODE_ENV=production
   PORT=10000
   VITE_APP_ID=proj_global_airports
   VITE_APP_TITLE=Global Airports
   VITE_APP_LOGO=https://placehold.co/40x40/3b82f6/ffffff?text=GA
   JWT_SECRET=<generate-a-secure-random-string>
   VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
   OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
   VITE_ANALYTICS_ENDPOINT=https://umami.dev.ops.butterfly-effect.dev
   VITE_ANALYTICS_WEBSITE_ID=analytics_proj_global_airports
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait 5-10 minutes for the first deployment
   - You'll receive a URL like: `https://global-airports.onrender.com`

#### Using render.yaml (Alternative Method)

This repository includes a `render.yaml` file for Infrastructure as Code deployment:

1. In Render dashboard, go to "Blueprint"
2. Click "New Blueprint Instance"
3. Connect your repository
4. Render will automatically detect and use `render.yaml`
5. Review settings and click "Apply"

#### Important Notes for Render Free Tier

- **Cold Starts**: Free tier services spin down after 15 minutes of inactivity
- **First Request**: May take 30-60 seconds to wake up after inactivity
- **No Database Required**: This app loads airport data from CSV files
- **Bandwidth**: 100 GB/month included
- **Build Minutes**: 500 minutes/month included

### Option 2: Railway

Railway offers a generous free tier with excellent developer experience.

#### Deployment Steps

1. **Sign up at Railway**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `bertintshisuaka2/Global-Airport`

3. **Configure Settings**
   - Railway auto-detects Node.js
   - Add environment variables (same as Render list above)
   - Set `PORT` to `$PORT` (Railway provides this automatically)

4. **Deploy**
   - Railway automatically builds and deploys
   - Get your public URL from the dashboard

### Option 3: Vercel (Frontend) + Separate Backend

Vercel is excellent for the React frontend but requires separate backend hosting.

#### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   vercel --prod
   ```

3. **Backend Deployment**
   - Deploy backend separately to Render or Railway
   - Update frontend environment variables with backend URL

### Option 4: Self-Hosting with Docker

#### Create Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
```

#### Build and Run

```bash
# Build Docker image
docker build -t global-airports .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  global-airports
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `production` |
| `PORT` | Yes | Server port | `3000` or `10000` |
| `VITE_APP_ID` | No | Application identifier | `proj_global_airports` |
| `VITE_APP_TITLE` | No | Application title | `Global Airports` |
| `VITE_APP_LOGO` | No | Logo URL | `https://example.com/logo.png` |
| `JWT_SECRET` | Yes | Secret for JWT tokens | Random 32+ char string |
| `DATABASE_URL` | No | MySQL connection (optional) | `mysql://user:pass@host:3306/db` |
| `VITE_OAUTH_PORTAL_URL` | No | OAuth portal URL | `https://vida.butterfly-effect.dev` |
| `OAUTH_SERVER_URL` | No | OAuth server URL | `https://vidabiz.butterfly-effect.dev` |
| `OPENAI_API_KEY` | No | OpenAI API key (if using AI features) | `sk-...` |

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Airport search functionality works
- [ ] Map displays correctly with markers
- [ ] Weather data loads for selected airports
- [ ] Continent/country filters work
- [ ] Mobile responsive design works
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS enabled (automatic on Render/Railway)
- [ ] Environment variables set correctly
- [ ] Monitor first few days for errors

## Troubleshooting

### Build Fails

**Issue**: Build fails with "out of memory"
**Solution**: Increase build resources or optimize build process

**Issue**: Missing dependencies
**Solution**: Ensure `pnpm-lock.yaml` is committed to repository

### Application Won't Start

**Issue**: Port binding error
**Solution**: Ensure `PORT` environment variable is set correctly

**Issue**: Missing environment variables
**Solution**: Check all required variables are set in hosting platform

### Map Not Loading

**Issue**: Leaflet tiles not displaying
**Solution**: Check CSP headers and ensure external tile servers are accessible

### Weather Data Not Loading

**Issue**: Weather API calls failing
**Solution**: Verify Open-Meteo API is accessible from your hosting region

## Performance Optimization

### For Production

1. **Enable Compression**
   - Render/Railway handle this automatically
   - For self-hosting, enable gzip in Express

2. **CDN for Static Assets**
   - Use Cloudflare or similar CDN
   - Cache static files aggressively

3. **Caching Strategy**
   - Airport data is cached in memory (already implemented)
   - Consider Redis for distributed caching if scaling

4. **Database** (Optional)
   - Currently not required for core functionality
   - Only needed for user authentication features
   - Can add PostgreSQL on Render free tier if needed

## Monitoring and Maintenance

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier available)
- **Analytics**: Google Analytics or Plausible
- **Logs**: Built-in platform logs (Render/Railway)

### Regular Maintenance

- Monitor build times and optimize if needed
- Check for dependency updates monthly
- Review error logs weekly
- Test critical paths after updates

## Scaling Considerations

### When to Upgrade from Free Tier

- Consistent traffic requiring 24/7 uptime
- Cold start delays affecting user experience
- Need for multiple regions/CDN
- Database requirements exceed free tier

### Horizontal Scaling

- Add load balancer
- Deploy to multiple regions
- Use Redis for session management
- Consider managed database service

## Support

For deployment issues:
- Check platform documentation (Render, Railway, etc.)
- Review application logs
- Test locally first with production build
- Verify all environment variables

## License

See LICENSE file in repository root.

---

**Last Updated**: October 2025
**Application Version**: 1.0.0
