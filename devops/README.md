# PlantCare — DevOps Setup

## Quick Start

cp devops/.env.example backend/.env
docker compose -f devops/docker-compose.yml up --build

App runs at: http://localhost:3000

## Requirements

- Docker
- Docker Compose

## Services

| Service  | Port | Description        |
|----------|------|--------------------|
| backend  | 3000 | Node.js Express API |
| db       | 5432 | PostgreSQL 15       |

## Health Check

curl http://localhost:3000/health

## Security

- Non-root user in Docker container
- Environment variables via .env file
- npm audit runs on every push via CI/CD
