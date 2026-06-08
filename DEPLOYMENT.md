# Agri E-Commerce Platform - Deployment & CI/CD Guide

## Architecture Overview
The system is deployed using a microservices-inspired architecture spanning multiple environments:
1. **Frontend (Next.js)**: Deployed on Vercel or AWS Amplify (Edge Network).
2. **Backend (.NET 9 Web API)**: Deployed as Docker containers on AWS ECS / EKS or Azure App Services.
3. **Database (PostgreSQL)**: Managed Database (AWS RDS / Azure Database for PostgreSQL).
4. **AI Services (FastAPI)**: Deployed as a distinct Docker service on specialized GPU nodes (if required) or standard containers.
5. **Caching**: Redis cluster (AWS ElastiCache).

## CI/CD Workflows (GitHub Actions)

### 1. Backend (.NET)
Triggered on push to `main` and paths `backend/**`.
- **Build**: `dotnet build`
- **Test**: `dotnet test`
- **Publish**: `dotnet publish -c Release -o out`
- **Docker Build & Push**: Builds the `Dockerfile` and pushes to Azure Container Registry / AWS ECR.

### 2. Frontend (Next.js)
Triggered on push to `main` and paths `apps/**` or `packages/**`.
- **Turborepo Cache**: Restores remote cache.
- **Build**: `npm run build`
- **Deploy**: Vercel Action or AWS S3/CloudFront Sync.

### 3. AI Services (Python)
- **Lint**: `flake8` and `mypy`.
- **Test**: `pytest`.
- **Docker Build & Push**: Pushes to Container Registry.

## Infrastructure as Code (Terraform)
We recommend utilizing Terraform to provision:
- The PostgreSQL RDS Instance.
- The Redis ElastiCache.
- The ECS Fargate clusters for the .NET API and FastAPI.

## Security & Scaling
- **Rate Limiting**: Built into the .NET API (100 requests / minute / IP).
- **SSL/TLS**: Terminated at the Load Balancer / CDN.
- **Auto-Scaling**: ECS configured to scale based on CPU (> 70%) or Request Count.
