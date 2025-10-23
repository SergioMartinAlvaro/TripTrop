# TripTrop Deployment Guide

This guide covers deploying TripTrop to production environments.

## Prerequisites

- Google Cloud Platform account
- Domain name (optional but recommended)
- PostgreSQL database (Cloud SQL recommended)
- Google OAuth2 credentials configured for production URLs
- Gemini API key

## Deployment Options

### Option 1: Google Cloud Platform (Recommended)

#### 1. Set up Cloud SQL (PostgreSQL)

```bash
# Create Cloud SQL instance
gcloud sql instances create triptrop-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create triptrop --instance=triptrop-db

# Create user
gcloud sql users create triptrop_user \
  --instance=triptrop-db \
  --password=SECURE_PASSWORD
```

#### 2. Configure Secret Manager

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secrets
echo -n "your-google-client-id" | gcloud secrets create google-client-id --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-
echo -n "your-jwt-secret-key" | gcloud secrets create jwt-secret-key --data-file=-
```

#### 3. Deploy Backend to Cloud Run

Create `backend/.dockerignore`:
```
__pycache__
*.pyc
.env
venv
.git
```

Build and deploy:
```bash
cd backend

# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/triptrop-backend

# Deploy to Cloud Run
gcloud run deploy triptrop-backend \
  --image gcr.io/PROJECT_ID/triptrop-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances PROJECT_ID:us-central1:triptrop-db \
  --set-env-vars DATABASE_URL="postgresql://triptrop_user:PASSWORD@/triptrop?host=/cloudsql/PROJECT_ID:us-central1:triptrop-db"
```

#### 4. Deploy Frontend to Firebase Hosting

```bash
cd frontend

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build production frontend
npm run build

# Deploy
firebase deploy
```

#### 5. Update OAuth2 URLs

In Google Cloud Console, update OAuth2 redirect URIs with your production URLs:
- Backend: `https://your-backend-url.run.app/api/v1/auth/callback`
- Frontend: `https://your-app.web.app/auth/callback`

### Option 2: AWS

#### 1. RDS PostgreSQL Setup

- Create RDS PostgreSQL instance
- Configure security groups
- Initialize database with `db_init.sql`

#### 2. ECS/Fargate Deployment

Create task definitions for:
- Backend (FastAPI)
- Frontend (Nginx serving static files)

#### 3. Secrets Manager

Store credentials in AWS Secrets Manager:
- Google OAuth2 credentials
- Gemini API key
- JWT secret
- Database credentials

### Option 3: Docker Compose on VPS

#### 1. Server Setup

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone repository
git clone https://github.com/SergioMartinAlvaro/TripTrop.git
cd TripTrop
```

#### 2. Configure Production Environment

Create `.env` files for both backend and frontend with production values.

#### 3. Set up Nginx Reverse Proxy

Create `/etc/nginx/sites-available/triptrop`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 4. Enable SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### 5. Start Services

```bash
docker-compose up -d
```

## Environment Variables (Production)

### Backend

```bash
DATABASE_URL=postgresql://user:pass@host:5432/triptrop
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/v1/auth/callback
GEMINI_API_KEY=your-gemini-key
SECRET_KEY=your-secure-secret-key
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
```

### Frontend

```bash
VITE_API_BASE_URL=https://yourdomain.com
```

## Database Migration

```bash
# Backup current database
pg_dump -h localhost -U triptrop_user triptrop > backup.sql

# Restore to new database
psql -h production-host -U triptrop_user triptrop < backup.sql
```

## Monitoring and Logging

### Google Cloud

- Enable Cloud Logging
- Set up Cloud Monitoring alerts
- Configure error reporting

### AWS

- CloudWatch Logs
- CloudWatch Metrics
- X-Ray for tracing

### Self-hosted

- Use Prometheus + Grafana for metrics
- ELK Stack for logging
- Sentry for error tracking

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Enable CORS only for your domain
- [ ] Use strong, unique SECRET_KEY
- [ ] Store secrets in Secret Manager, not in code
- [ ] Enable database encryption at rest
- [ ] Set up regular database backups
- [ ] Configure firewall rules properly
- [ ] Keep dependencies updated
- [ ] Enable rate limiting (add nginx rate limiting or API rate limiting)
- [ ] Set up CSP headers
- [ ] Enable HSTS
- [ ] Regular security audits

## Scaling Considerations

### Horizontal Scaling

- Backend: Multiple Cloud Run instances or ECS tasks
- Frontend: CDN (CloudFlare, AWS CloudFront)
- Database: Read replicas for read-heavy workloads

### Caching

- Redis for session storage
- CDN for static assets
- Database query caching

### Performance

- Enable gzip compression
- Optimize images
- Implement lazy loading
- Use pagination for large datasets
- Database indexing on frequently queried fields

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          gcloud run deploy triptrop-backend \
            --image gcr.io/PROJECT_ID/triptrop-backend
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          firebase deploy
```

## Troubleshooting

### Database Connection Issues

- Check Cloud SQL instance is running
- Verify network connectivity
- Check credentials in Secret Manager
- Review Cloud SQL logs

### OAuth2 Issues

- Verify redirect URIs match exactly
- Check CORS configuration
- Verify client ID and secret

### Performance Issues

- Check Cloud Run instance limits
- Review database query performance
- Enable Cloud CDN
- Check for N+1 queries

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and rotate secrets quarterly
- Database backup verification weekly
- Log review daily
- Performance monitoring ongoing

### Updates

```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
pip install -r requirements.txt
# Run migrations if needed

# Frontend
cd frontend
npm install
npm run build

# Restart services
docker-compose restart
```

## Support

For deployment issues, check:
- Cloud provider status pages
- Application logs
- Database logs
- GitHub Issues
