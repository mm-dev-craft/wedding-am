# GitHub Actions Setup

Diese Dateien ermöglichen es, Ihre Website automatisch zu bauen und als Docker Container bereitzustellen.

## Erstellte Dateien

1. **`.github/workflows/build-and-deploy.yml`** - GitHub Actions Workflow
2. **`Dockerfile`** - Multi-stage Docker Build für lokale Entwicklung
3. **`Dockerfile.production`** - Optimiertes Production Dockerfile (verwendet gebaute Dateien)
4. **`nginx.conf`** - Nginx Konfiguration
5. **`.dockerignore`** - Docker Ignore Datei
6. **`docker-compose.yml`** - Lokale Entwicklung

## Build-Strategie

### GitHub Actions (Production)
- Baut das Projekt einmal mit `npm run build`
- Verwendet `Dockerfile.production` (nur nginx + gebaute Dateien)
- Schneller, da kein Node.js im Docker Image benötigt wird

### Lokale Entwicklung
- Verwendet `Dockerfile` mit Multi-stage Build
- Baut das Projekt im Docker Container selbst
- Praktisch für lokale Tests ohne vorherigen Build-Schritt

## Setup-Schritte

### 1. GitHub Secrets konfigurieren

In Ihrem GitHub Repository unter Settings > Secrets and variables > Actions:

```
DOCKER_USERNAME - Ihr Docker Hub Benutzername
DOCKER_PASSWORD - Ihr Docker Hub Passwort/Token
```

### 2. Lokaler Test

```bash
# Docker Image bauen
docker build -t hochzeit-website .

# Container starten
docker run -p 8080:80 hochzeit-website

# Oder mit docker-compose
docker-compose up -d
```

Die Website ist dann unter http://localhost:8080 erreichbar.

### 3. GitHub Actions

Der Workflow wird automatisch ausgelöst bei:
- Push auf `main` oder `master` Branch
- Pull Requests

Der Workflow:
1. Installiert Node.js Dependencies
2. Baut die Website mit `npm run build`
3. Erstellt ein Docker Image
4. Pushed das Image zu Docker Hub

### 4. Deployment (Optional)

Fügen Sie in der GitHub Action einen Deployment-Schritt hinzu, um:
- SSH zu Ihrem Server
- Das neue Docker Image pullen
- Container neu starten

## Nginx Features

- Gzip Kompression
- Security Headers
- Static Asset Caching
- SPA Support (falls benötigt)
- Health Check Endpoint (`/health`)

## Anpassungen

- **Docker Hub Repository**: Ändern Sie `${{ secrets.DOCKER_USERNAME }}/hochzeit-website` in der GitHub Action
- **Nginx Config**: Passen Sie `nginx.conf` nach Bedarf an
- **Ports**: Standard ist Port 80 im Container, 8080 lokal
