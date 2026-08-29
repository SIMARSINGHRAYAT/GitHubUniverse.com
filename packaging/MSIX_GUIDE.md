# Git Crazy — Windows MSIX & APPX Packaging Guide

Welcome to **Git Crazy** (`GIT CRAZY`), a worldwide discovery, collection, bookmarking, and tracking platform for GitHub repositories packaged as a production-ready Windows MSIX/APPX application with a pixel-art retro computing operating aesthetic.

---

## 1. Prerequisites & Dependencies

To develop and package Git Crazy on Windows 10/11:

- **Node.js**: v18.0 or higher
- **PostgreSQL**: v14 or higher (or docker container)
- **Windows SDK**: (included with Windows 10/11 or Visual Studio Build Tools)
- **PowerShell**: 5.1 or PowerShell 7+

---

## 2. Environment Configuration & GitHub OAuth

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/github/callback
```

*Note:* If GitHub OAuth secrets are omitted, Git Crazy automatically provides a **Mock Dev Authentication Session** mode.

---

## 3. Running in Development Mode

```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npx drizzle-kit push

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to launch Git Crazy in browser/electron runtime.

---

## 4. Building Production Web App

```bash
npm run build
```

---

## 5. Building Production Windows MSIX & APPX Package

To assemble the Windows application package:

```bash
# Verify package manifest
node scripts/build-msix.js

# Build MSIX package
npm run build:msix
```

The output MSIX installer will be generated at:
`./dist/GitCrazy_1.0.0.0_x64.msix`

---

## 6. Installing Local MSIX Package via PowerShell

Open PowerShell as Administrator and run:

```powershell
Add-AppxPackage -Path ".\dist\GitCrazy_1.0.0.0_x64.msix"
```

To launch the installed application:
Press `Win + S` and search for **Git Crazy**!

---

## 7. Application Architecture

- **Visual Style**: Pixel retro-computing system with 8-bit typography, falling GitHub Octocat rain, and CRT scanlines.
- **Database**: PostgreSQL via Drizzle ORM storing users, custom collections, saved repos, pinned items, and settings.
- **Audio Synthesizer**: Web Audio API retro 8-bit sound effects.
- **Service Abstraction**: Live GitHub REST API proxy with automatic rate-limit fallback to curated seed dataset.
