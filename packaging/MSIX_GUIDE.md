# GitHub Universe — Windows MSIX Packaging Guide

This guide covers the Windows MSIX test package for **GitHub Universe**, a GitHub repository discovery application with a pixel-art retro computing aesthetic.

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

## 5. Building the Windows MSIX Test Package

To assemble the Windows application package:

```bash
# Verify packaging metadata
node scripts/build-msix.js

# Build the signed local test package and copy it to Downloads
$env:MSIX_CERT_PASSWORD = "GitHubUniverseLocal2026!"
npm run package:windows-test
```

The output bundle is generated at:
`%USERPROFILE%\Downloads\GitHubUniverse-MSIX-Test`

It contains the signed x64 MSIX, the public `GitHubUniverse-Local.cer`, the password-protected test PFX, and `INSTALL-TEST-PACKAGE.md`.

---

## 6. Installing Local MSIX Package via PowerShell

First open `GitHubUniverse-Local.cer`, choose **Install Certificate**, select **Local Machine**, and place it in **Trusted People**. Then open PowerShell as Administrator and run:

```powershell
Add-AppxPackage -Path ".\GitHubUniverse-1.0.0-x64.msix"
```

The local test certificate is self-signed and must not be used for Partner Center submission. Partner Center requires a package signed by the Microsoft Store or an approved production certificate.

---

## 7. Application Architecture

- **Visual Style**: Pixel retro-computing system with 8-bit typography, falling GitHub rain, and CRT scanlines.
- **Database**: PostgreSQL via Drizzle ORM storing users, custom collections, saved repos, pinned items, and settings.
- **Audio Synthesizer**: Web Audio API retro 8-bit sound effects.
- **Service Abstraction**: Live GitHub REST API proxy with automatic rate-limit fallback to curated seed dataset.
