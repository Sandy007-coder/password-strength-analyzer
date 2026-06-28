<div align="center">

# ⚡ CipherGuard
### A Real-Time Password Security Analysis Platform
### with Entropy Scoring and Cryptographic Hashing

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-00ffa3?style=flat-square)](LICENSE)

**Final Year Cybersecurity Project · Flask + React · PBKDF2-SHA256 · Shannon Entropy**

[Features](#-features) · [Architecture](#-architecture) · [Setup](#-setup) · [API Reference](#-api-reference) · [Security](#-security-design) · [Tech Stack](#-tech-stack)

</div>

---

## Overview

**CipherGuard** is a full-stack cybersecurity platform that analyses password strength in real time using Shannon entropy calculation, a 10-rule scoring engine, and PBKDF2-HMAC-SHA256 cryptographic hashing. Passwords flagged as weak or medium receive a securely generated replacement suggestion. All saved records are stored as cryptographic hashes — plain text never touches the database.

Built as a Final Year Cybersecurity Engineering project, the platform demonstrates production-grade secure coding practices, REST API design, and a professional security-themed UI.

---

## ✨ Features

### Security Engine
- **Real-time analysis** — debounced password evaluation on every keystroke
- **Shannon entropy calculation** — bits calculated from character pool size
- **10-rule scoring system** — length tiers, character classes, entropy thresholds, breach list
- **PBKDF2-HMAC-SHA256 hashing** — 600,000 iterations with a 256-bit random salt per password
- **SHA-256 fingerprinting** — O(1) reuse detection without KDF re-computation
- **Common password blocklist** — 120+ entries checked case-insensitively
- **CSPRNG password generation** — cryptographically secure suggested replacements
- **Constant-time comparison** — `hmac.compare_digest()` prevents timing attacks

### Platform Features
- Password history with score, entropy, strength, and timestamp metadata
- Filterable history page with aggregate statistics
- API health monitoring with live status indicator in navbar
- Two-click confirmation for destructive operations
- Toast notification system with success, error, warn, and info states
- Fully responsive layout — mobile through desktop

### Frontend
- Retro-futuristic cyberpunk UI with glassmorphism panels
- Animated entropy ring (SVG), strength segments, checklist rows
- Staggered fade animations, scanline overlay, corner bracket accents
- Skeleton loading states for all async content
- Copy to clipboard, show/hide toggle, one-click clear

---

## 🏗 Architecture

```
password-strength-analyzer/
│
├── backend/                          ← Flask REST API
│   ├── main.py                       ← Application entry point
│   ├── config.py                     ← Environment configuration
│   ├── requirements.txt              ← Python dependencies
│   ├── .env                          ← Environment variables (never commit)
│   │
│   ├── database/
│   │   └── db.py                     ← SQLite CRUD (WAL mode, context manager)
│   │
│   ├── models/
│   │   └── password_model.py         ← PasswordRecord dataclass
│   │
│   ├── routes/
│   │   └── password_routes.py        ← REST endpoint handlers
│   │
│   ├── services/
│   │   ├── password_checker.py       ← 10-rule scoring engine
│   │   ├── entropy_calculator.py     ← Shannon entropy calculation
│   │   ├── password_generator.py     ← CSPRNG password generator
│   │   └── hash_service.py           ← PBKDF2-SHA256 + fingerprinting
│   │
│   └── utils/
│       ├── validators.py             ← Input validation
│       └── common_passwords.py       ← Breach password blocklist
│
└── frontend/                         ← React + Vite + Tailwind
    ├── index.html                    ← Vite entry point
    ├── vite.config.js                ← Dev server + proxy config
    ├── tailwind.config.js            ← Design tokens
    ├── postcss.config.js
    │
    └── src/
        ├── App.jsx                   ← Router shell + scanline overlay
        ├── main.jsx                  ← React entry point
        ├── index.css                 ← Global styles + CSS variables
        │
        ├── assets/
        │   ├── logo.svg              ← CipherGuard wordmark
        │   ├── hero-bg.svg           ← Dashboard background
        │   └── empty-state.svg       ← Empty history illustration
        │
        ├── components/
        │   ├── Navbar.jsx            ← Fixed nav with API health polling
        │   ├── Footer.jsx            ← Tech stack + navigation links
        │   ├── PasswordInput.jsx     ← Input with show/hide, copy, generate
        │   ├── StrengthMeter.jsx     ← Entropy ring + 4-segment strength bar
        │   ├── PasswordChecklist.jsx ← Animated pass/fail rule checklist
        │   ├── SuggestionsPanel.jsx  ← Improvement recommendations
        │   ├── PasswordHistory.jsx   ← Sidebar history widget
        │   └── Loader.jsx            ← Dots loader, page loader, skeletons
        │
        ├── pages/
        │   ├── Dashboard.jsx         ← Main analysis interface
        │   ├── History.jsx           ← Filterable history with statistics
        │   └── About.jsx             ← Project docs + API reference
        │
        └── services/
            └── api.js                ← Native fetch client (no Axios)
```

---

## ⚙️ Setup

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Python      | 3.11+   |
| Node.js     | 18+     |
| npm         | 9+      |

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd password-strength-analyzer/backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Generate a strong SECRET_KEY
python -c "import secrets; print(secrets.token_hex(64))"

# 6. Paste the output into .env as SECRET_KEY=<your-key>

# 7. Start the Flask server
python main.py
# → API running at http://localhost:5000
```

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd password-strength-analyzer/frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → App running at http://localhost:3000
```

### Production Build

```bash
cd frontend
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000
```

---

### `POST /analyze-password`
Analyse a password and return strength metrics, checks, and suggestions.

**Request**
```json
{ "password": "MyS3cur3P@ss!" }
```

**Response `200`**
```json
{
  "success": true,
  "strength": "Strong",
  "score": 8,
  "max_score": 10,
  "entropy": 77.7,
  "checks": {
    "length": true,
    "uppercase": true,
    "lowercase": true,
    "numbers": true,
    "special_characters": true,
    "not_common": true
  },
  "suggestions": [],
  "suggested_password": null
}
```

---

### `POST /save-password`
Hash with PBKDF2-SHA256 and persist. Returns `409` on reuse detection.

**Request**
```json
{ "password": "MyS3cur3P@ss!" }
```

**Response `201`**
```json
{
  "success": true,
  "message": "Password saved successfully.",
  "record_id": 1,
  "strength": "Strong",
  "score": 8,
  "entropy": 77.7
}
```

**Response `409`**
```json
{
  "success": false,
  "error": "This password has already been saved. Choose a different password to avoid reuse."
}
```

---

### `GET /password-history`
Return saved records metadata — no plain text, no hashes.

**Response `200`**
```json
{
  "success": true,
  "count": 2,
  "history": [
    { "id": 2, "strength": "Very Strong", "score": 10, "entropy": 95.1, "created_at": "2024-07-15T10:30:00Z" },
    { "id": 1, "strength": "Strong",      "score": 8,  "entropy": 77.7, "created_at": "2024-07-15T10:25:00Z" }
  ]
}
```

---

### `DELETE /clear-history`
Permanently delete all stored records.

**Response `200`**
```json
{ "success": true, "message": "History cleared.", "deleted_count": 2 }
```

---

### `GET /health`
Liveness probe for deployment environments.

**Response `200`**
```json
{ "success": true, "status": "healthy" }
```

---

### Testing with cURL

```bash
# Analyse
curl -X POST http://localhost:5000/analyze-password \
     -H "Content-Type: application/json" \
     -d '{"password": "MyS3cur3P@ss!"}'

# Save
curl -X POST http://localhost:5000/save-password \
     -H "Content-Type: application/json" \
     -d '{"password": "MyS3cur3P@ss!"}'

# History
curl http://localhost:5000/password-history

# Clear
curl -X DELETE http://localhost:5000/clear-history

# Health
curl http://localhost:5000/health
```

---

## 🏆 Scoring System

### Strength Bands

| Score | Strength    |
|-------|-------------|
| 0–3   | Weak        |
| 4–5   | Medium      |
| 6–7   | Strong      |
| 8–10  | Very Strong |

### Scoring Rules (1 point each · max 10)

| Rule                 | Condition                        |
|----------------------|----------------------------------|
| `min_length`         | Length ≥ 8 characters            |
| `good_length`        | Length ≥ 12 characters           |
| `extra_length`       | Length ≥ 16 characters           |
| `uppercase`          | Contains A–Z                     |
| `lowercase`          | Contains a–z                     |
| `numbers`            | Contains 0–9                     |
| `special_characters` | Contains `!@#$%^&*` etc.         |
| `no_common`          | Not in breach password blocklist |
| `high_entropy`       | Entropy ≥ 60 bits                |
| `very_high_entropy`  | Entropy ≥ 80 bits                |

---

## 🛡️ Security Design

### Cryptographic Decisions

| Decision | Implementation | Rationale |
|----------|---------------|-----------|
| Password hashing | PBKDF2-HMAC-SHA256 | NIST SP 800-132 compliant |
| Iteration count | 600,000 | NIST SP 800-63B recommendation for 2024 |
| Salt size | 256-bit random per password | Prevents rainbow table attacks |
| Reuse detection | SHA-256 fingerprint | O(1) lookup without KDF re-computation |
| Comparison | `hmac.compare_digest()` | Prevents timing side-channel attacks |
| Input cap | 1,000 characters max | Prevents DoS via KDF computation |
| History data | Metadata only | Plain text and hashes never leave the server |

### Secure Coding Practices
- Passwords processed in memory only — never logged or written as plain text
- All inputs validated and sanitised server-side before processing
- Environment secrets loaded from `.env` — never hard-coded
- Production guard raises `RuntimeError` if default `SECRET_KEY` is used in production
- CORS configurable — restrict to frontend origin in production
- SQLite WAL mode — safe concurrent read/write without data corruption
- Constant-time hash comparison — eliminates timing oracle vulnerability

---

## 🗄️ Database Schema

```sql
CREATE TABLE IF NOT EXISTS password_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    bcrypt_hash TEXT    NOT NULL,
    sha256_fp   TEXT    NOT NULL UNIQUE,
    strength    TEXT    NOT NULL,
    score       INTEGER NOT NULL,
    entropy     REAL    NOT NULL,
    created_at  TEXT    NOT NULL
);
```

> `bcrypt_hash` and `sha256_fp` are stored server-side only and never returned to the frontend.

---

## 🧰 Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Core language |
| Flask | 2.3+ | REST API framework |
| SQLite | — | Persistent storage |
| PBKDF2-HMAC-SHA256 | — | Password hashing |
| python-dotenv | 1.0+ | Environment configuration |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 5.2 | Build tool + dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | v6 | Client-side routing |
| React Icons | 5.2 | Icon library |
| Native Fetch API | — | HTTP client (no Axios) |

---

## 🌐 Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | — | Flask secret key — **must be changed in production** |
| `FLASK_ENV` | `development` | Runtime environment |
| `FLASK_HOST` | `0.0.0.0` | Server bind address |
| `FLASK_PORT` | `5000` | Server port |
| `DATABASE_PATH` | `database/passwords.db` | SQLite file path |
| `BCRYPT_ROUNDS` | `12` | PBKDF2 work factor multiplier |
| `MAX_HISTORY` | `100` | Maximum history records before eviction |

### Frontend (`.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://127.0.0.1:5000` | Backend API base URL |

---

## 🖥️ VS Code Setup

### Backend
1. Open `backend/` folder in VS Code
2. Install the **Python** extension by Microsoft
3. Select interpreter: `Ctrl+Shift+P` → *Python: Select Interpreter* → choose `venv`
4. Recommended `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "editor.formatOnSave": true
}
```

### Frontend
1. Open `frontend/` folder in VS Code
2. Install extensions:
   - **Tailwind CSS IntelliSense**
   - **ES7+ React/Redux/React-Native snippets**
   - **Prettier – Code formatter**
3. Recommended `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## 📋 Project Information

| Field | Detail |
|-------|--------|
| **Project Title** | CipherGuard: A Real-Time Password Security Analysis Platform with Entropy Scoring and Cryptographic Hashing |
| **Short Name** | Password Strength Analyzer |
| **Type** | Final Year Cybersecurity Project |
| **Stack** | Full-Stack — Python Flask + React |
| **Database** | SQLite with WAL mode |
| **Hashing Algorithm** | PBKDF2-HMAC-SHA256 |
| **Compliance** | NIST SP 800-132 · NIST SP 800-63B |

---

<div align="center">

Built with precision for cybersecurity education and portfolio demonstration.

**CipherGuard** · Password Strength Analyzer · Final Year Cybersecurity Project

</div>
```