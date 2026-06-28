# PASSWORD STRENGTH ANALYZER

### Powered by CipherGuard

> A professional full-stack cybersecurity platform featuring real-time password strength analysis, Shannon entropy calculation, PBKDF2-SHA256 cryptographic hashing, breach reuse detection, and secure password history management

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.3+-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PBKDF2](https://img.shields.io/badge/PBKDF2--SHA256-600K_Iterations-00ffa3?style=for-the-badge)

</div>

---

## 📌 Overview

The **Password Strength Analyzer** is a production-ready cybersecurity platform that evaluates password security in real time using Shannon entropy calculation, a 10-rule scoring engine, and industry-standard PBKDF2-HMAC-SHA256 hashing. Weak or medium passwords automatically receive a cryptographically secure generated replacement. All saved records are stored as hashes — plain text never touches the database.

| What it does | How |
|---|---|
| Real-time password analysis | 10-rule scoring engine + Shannon entropy |
| Cryptographic hashing | PBKDF2-HMAC-SHA256 · 600,000 iterations · 256-bit salt |
| Breach reuse detection | SHA-256 fingerprint · O(1) lookup |
| Secure password generation | CSPRNG · guaranteed character class coverage |
| History management | Metadata only · no plain text ever stored |
| Common password detection | 120+ entry blocklist · case-insensitive matching |

---

## 🏗️ Architecture

```
User Types Password
        ↓
Debounced POST Request (380ms)
        ↓
Input Validation (validators.py)
        ↓
10-Rule Scoring Engine (password_checker.py)
        ↓
Shannon Entropy Calculation (entropy_calculator.py)
        ↓
Common Password Blocklist Check (common_passwords.py)
        ↓
Strength Label + Score + Suggestions
        ↓
React CipherGuard Dashboard
        ↓
User Clicks Save
        ↓
PBKDF2-SHA256 Hash + SHA-256 Fingerprint
        ↓
SQLite History (metadata only)
```

---

## 🛠️ Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Framework | Python 3.11+, Flask 2.3+ |
| Database | SQLite3 (WAL mode) |
| Hashing | PBKDF2-HMAC-SHA256 · 600,000 iterations |
| Reuse Detection | SHA-256 fingerprinting |
| Config | python-dotenv |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 |
| Build Tool | Vite 5.2 |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router DOM v6 |
| HTTP Client | Native Fetch API |
| Icons | React Icons 5.2 |

---

## 📁 Project Structure

```
password-strength-analyzer/
│
├── backend/
│   ├── main.py                       # Flask entry point
│   ├── config.py                     # Environment configuration + production guard
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables (never commit)
│   │
│   ├── database/
│   │   └── db.py                     # SQLite CRUD (WAL mode, context manager)
│   │
│   ├── models/
│   │   └── password_model.py         # PasswordRecord dataclass
│   │
│   ├── routes/
│   │   └── password_routes.py        # REST endpoint handlers
│   │
│   ├── services/
│   │   ├── password_checker.py       # 10-rule scoring engine
│   │   ├── entropy_calculator.py     # Shannon entropy calculation
│   │   ├── password_generator.py     # CSPRNG password generator
│   │   └── hash_service.py           # PBKDF2-SHA256 + SHA-256 fingerprinting
│   │
│   └── utils/
│       ├── validators.py             # Input validation + blank-strip protection
│       └── common_passwords.py       # Breach password blocklist (frozenset)
│
└── frontend/
    ├── index.html                    # Vite entry point + OG/Twitter meta tags
    ├── vite.config.js                # Dev server + API proxy config
    ├── tailwind.config.js            # Design tokens
    ├── postcss.config.js
    │
    └── src/
        ├── App.jsx                   # Router shell + scanline overlay
        ├── main.jsx                  # React entry point
        ├── index.css                 # Global styles + CSS variables
        │
        ├── assets/
        │   ├── logo.svg              # CipherGuard wordmark
        │   ├── hero-bg.svg           # Dashboard background asset
        │   └── empty-state.svg       # Empty history illustration
        │
        ├── components/
        │   ├── Navbar.jsx            # Fixed nav with live API health polling
        │   ├── Footer.jsx            # Tech stack + navigation links
        │   ├── PasswordInput.jsx     # Input with show/hide, copy, clear, generate
        │   ├── StrengthMeter.jsx     # SVG entropy ring + 4-segment strength bar
        │   ├── PasswordChecklist.jsx # Animated pass/fail rule checklist
        │   ├── SuggestionsPanel.jsx  # Improvement recommendations panel
        │   ├── PasswordHistory.jsx   # Sidebar history widget with confirm delete
        │   └── Loader.jsx            # Dots loader, page loader, skeleton cards
        │
        ├── pages/
        │   ├── Dashboard.jsx         # Main analysis interface
        │   ├── History.jsx           # Filterable history page with statistics
        │   └── About.jsx             # Project documentation + API reference
        │
        └── services/
            └── api.js                # Native fetch client with error enrichment
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/password-strength-analyzer.git
cd password-strength-analyzer
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate a strong SECRET_KEY
python -c "import secrets; print(secrets.token_hex(64))"

# Open .env and paste the output as SECRET_KEY=<your-key>

# Start the backend server
python main.py
```

Backend runs at: `http://127.0.0.1:5000`  
Health check: `http://127.0.0.1:5000/health`

### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Production Build

```bash
cd frontend
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

---

## 🔑 Environment Variables

### Backend (`.env`)

```env
# Flask secret key — generate with:
# python -c "import secrets; print(secrets.token_hex(64))"
SECRET_KEY=change-me-to-a-long-random-secret-key-in-production

# Runtime environment: development | production
FLASK_ENV=development

# Server bind address and port
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# SQLite database file path
DATABASE_PATH=database/passwords.db

# PBKDF2 work factor — multiplied on top of 50,000 base iterations
BCRYPT_ROUNDS=12

# Maximum history records before oldest is evicted
MAX_HISTORY=100
```

### Frontend (`.env.local`)

```env
VITE_API_URL=http://127.0.0.1:5000
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| Password hashing | PBKDF2-HMAC-SHA256 · 600,000 iterations |
| Salt | 256-bit cryptographically random per password |
| Reuse detection | SHA-256 fingerprint · constant-time comparison |
| Timing attack prevention | `hmac.compare_digest()` |
| DoS prevention | 1,000 character input cap rejects KDF abuse |
| Plain text protection | Passwords never logged or stored |
| Production guard | `RuntimeError` raised if default `SECRET_KEY` used in production |
| SQL injection prevention | Parameterized queries throughout |
| Input validation | Server-side validation on all endpoints |
| CORS | Configurable — restrict to frontend origin in production |
| Database safety | SQLite WAL mode — safe concurrent read/write |

---

## 🌐 API Reference

### Base URL
```
http://localhost:5000
```

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/analyze-password` | Analyse strength · returns score, entropy, checks, suggestions | No |
| POST | `/save-password` | Hash + persist · returns 409 on reuse detection | No |
| GET | `/password-history` | Return metadata records · no hashes · no plain text | No |
| DELETE | `/clear-history` | Permanently delete all records | No |
| GET | `/health` | Liveness probe for deployment environments | No |

---

### `POST /analyze-password`

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

**Response `409` — Reuse detected**
```json
{
  "success": false,
  "error": "This password has already been saved. Choose a different password to avoid reuse."
}
```

---

### `GET /password-history`

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

### Testing with cURL

```bash
# Analyse a password
curl -X POST http://localhost:5000/analyze-password \
     -H "Content-Type: application/json" \
     -d '{"password": "MyS3cur3P@ss!"}'

# Save a password
curl -X POST http://localhost:5000/save-password \
     -H "Content-Type: application/json" \
     -d '{"password": "MyS3cur3P@ss!"}'

# View history
curl http://localhost:5000/password-history

# Clear history
curl -X DELETE http://localhost:5000/clear-history

# Health check
curl http://localhost:5000/health
```

---

## 📊 Scoring System

### Strength Bands

| Score | Strength    |
|-------|-------------|
| 0–3   | Weak        |
| 4–5   | Medium      |
| 6–7   | Strong      |
| 8–10  | Very Strong |

### Scoring Rules (1 point each · max 10)

| Rule | Condition |
|---|---|
| `min_length` | Length ≥ 8 characters |
| `good_length` | Length ≥ 12 characters |
| `extra_length` | Length ≥ 16 characters |
| `uppercase` | Contains A–Z |
| `lowercase` | Contains a–z |
| `numbers` | Contains 0–9 |
| `special_characters` | Contains `!@#$%^&*` etc. |
| `no_common` | Not in breach password blocklist |
| `high_entropy` | Entropy ≥ 60 bits |
| `very_high_entropy` | Entropy ≥ 80 bits |

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

## 🎨 Design System

- **Theme** — Retro-futuristic cyberpunk aesthetic · deep navy voids + neon cyan accents
- **Cards** — Glassmorphism with backdrop blur + neon glow borders
- **Fonts** — Orbitron (display) · Rajdhani (body) · JetBrains Mono (code/data)
- **Colors** — `#02060f` void · `#00b4ff` cyan · `#00ffa3` green · `#ff2d55` red · `#ffd60a` amber
- **Animations** — Scanline sweep · entropy ring fill · staggered fade-ups · toast slides · skeleton shimmer

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

## 🔄 Fresh Setup After Clone

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1       # Windows
source venv/bin/activate           # macOS / Linux
pip install -r requirements.txt
# Fill in .env with SECRET_KEY
python main.py

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Author

**Sarveswaran S**

- B.Tech — Computer Science & Engineering (Cybersecurity)
- 🔐 Cybersecurity, Python, Full-Stack Development & Data Analytics Enthusiast
- 🎯 Interested in Penetration Testing, Red Teaming, and Data Analysis

🔗 GitHub: https://github.com/Sandy007-coder

🔗 LinkedIn: https://www.linkedin.com/in/sarveswaran-cybersec?utm_source=share_via&utm_content=profile&utm_medium=member_android

---

## 📋 Project Information

| Field | Detail |
|---|---|
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

**Password Strength Analyzer** · Powered by CipherGuard · Final Year Cybersecurity Project

</div>
