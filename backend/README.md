# 🔐 Password Strength Analyzer – Backend API

A production-ready REST API built with **Python 3 + Flask** that analyses password strength,
calculates entropy, checks against common password lists, hashes passwords with bcrypt,
and stores analysis history in SQLite.

---

## 📁 Folder Structure

```
password-strength-analyzer-backend/
│
├── app.py                  ← Flask entry point (run this)
├── config.py               ← All settings (reads from .env)
├── requirements.txt        ← Python dependencies
├── .env                    ← Environment variables (never commit this)
├── README.md               ← You are here
│
├── database/
│   ├── db.py               ← SQLite CRUD helpers
│   └── passwords.db        ← SQLite database file (auto-created)
│
├── routes/
│   └── password_routes.py  ← All REST endpoint handlers
│
├── services/
│   ├── password_checker.py   ← Core analysis engine
│   ├── entropy_calculator.py ← Shannon entropy calculator
│   ├── password_generator.py ← Secure password generator
│   └── hash_service.py       ← bcrypt + SHA-256 helpers
│
├── utils/
│   ├── validators.py         ← Input validation helpers
│   └── common_passwords.py   ← Block-list of 100+ common passwords
│
└── models/
    └── password_model.py     ← PasswordRecord dataclass
```

---

## ⚙️ Setup Instructions

### 1 – Prerequisites

| Requirement | Version |
|-------------|---------|
| Python      | 3.11+   |
| pip         | latest  |

Check your Python version:
```bash
python --version    # or python3 --version
```

---

### 2 – Clone / Download the project

```bash
# If using git:
git clone https://github.com/your-repo/password-strength-analyzer-backend.git
cd password-strength-analyzer-backend

# Or just cd into the downloaded folder:
cd password-strength-analyzer-backend
```

---

### 3 – Create a virtual environment

A virtual environment isolates the project's dependencies from your system Python.

```bash
# Create the virtual environment
python -m venv venv

# Activate it:
# macOS / Linux
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

You should see `(venv)` at the start of your terminal prompt.

---

### 4 – Install dependencies

```bash
pip install -r requirements.txt
```

---

### 5 – Configure environment variables

Copy the example `.env` file (it is already included) and edit it:

```bash
# The .env file is already in the project root.
# Open it and change SECRET_KEY to a long random string.
```

`.env` file contents:
```
SECRET_KEY=change-me-to-a-long-random-secret-key-in-production
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
DATABASE_PATH=database/passwords.db
BCRYPT_ROUNDS=12
MAX_HISTORY=100
```

---

### 6 – Run the server

```bash
python app.py
```

You should see:
```
╔══════════════════════════════════════════════╗
║   Password Strength Analyzer API             ║
║   Running on http://0.0.0.0:5000             ║
║   Environment: development                   ║
╚══════════════════════════════════════════════╝
```

The API is now live at **http://localhost:5000**

---

## 🗄️ SQLite Schema

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

> Plain-text passwords are **never** stored.

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

---

### `POST /analyze-password`

Analyse a password without saving it.

**Request**
```json
{ "password": "MyS3cur3P@ss!" }
```

**Response 200**
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

**Response 200 (weak password)**
```json
{
  "success": true,
  "strength": "Weak",
  "score": 2,
  "max_score": 10,
  "entropy": 18.84,
  "checks": {
    "length": false,
    "uppercase": false,
    "lowercase": true,
    "numbers": true,
    "special_characters": false,
    "not_common": true
  },
  "suggestions": [
    "Use at least 8 characters.",
    "Add at least one uppercase letter (A–Z).",
    "Add at least one special character (e.g. ! @ # $ % ^ & *)."
  ],
  "suggested_password": "Kx$9mP@qLr2!vBnZ"
}
```

---

### `POST /save-password`

Analyse, hash with bcrypt, and persist a password record.

**Request**
```json
{ "password": "MyS3cur3P@ss!" }
```

**Response 201**
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

**Response 409 (reuse detected)**
```json
{
  "success": false,
  "error": "This password has already been saved. Please choose a different password to avoid reuse."
}
```

---

### `GET /password-history`

Retrieve all saved records (metadata only – no hashes, no plain text).

**Response 200**
```json
{
  "success": true,
  "count": 2,
  "history": [
    {
      "id": 2,
      "strength": "Very Strong",
      "score": 10,
      "entropy": 95.1,
      "created_at": "2024-07-15T10:30:00Z"
    },
    {
      "id": 1,
      "strength": "Strong",
      "score": 8,
      "entropy": 77.7,
      "created_at": "2024-07-15T10:25:00Z"
    }
  ]
}
```

---

### `DELETE /clear-history`

Permanently delete all password records.

**Response 200**
```json
{
  "success": true,
  "message": "History cleared.",
  "deleted_count": 2
}
```

---

### `GET /health`

Liveness probe for load-balancers / Docker health-checks.

**Response 200**
```json
{ "success": true, "status": "healthy" }
```

---

## 🧪 Testing with cURL

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
```

---

## 🧪 Testing with Postman / Thunder Client

1. Import the base URL `http://localhost:5000`.
2. Set `Content-Type: application/json` in headers.
3. Use the request bodies from the examples above.

---

## 🏆 Scoring System

| Points | Strength    |
|--------|-------------|
| 0–3    | Weak        |
| 4–5    | Medium      |
| 6–7    | Strong      |
| 8–10   | Very Strong |

### Score rules (each = 1 point, max 10)

| Rule              | Condition                             |
|-------------------|---------------------------------------|
| min_length        | ≥ 8 characters                        |
| good_length       | ≥ 12 characters                       |
| extra_length      | ≥ 16 characters                       |
| uppercase         | Contains A–Z                          |
| lowercase         | Contains a–z                          |
| numbers           | Contains 0–9                          |
| special_characters| Contains !@#$ etc.                    |
| no_common         | Not in common password block-list     |
| high_entropy      | Entropy ≥ 60 bits                     |
| very_high_entropy | Entropy ≥ 80 bits                     |

---

## 🛡️ Security Practices

- Plain-text passwords are **never** stored or logged.
- Passwords are hashed with **bcrypt** (configurable work factor).
- **SHA-256** fingerprints are used only for reuse detection.
- Input is validated and length-capped to prevent DoS.
- CORS is configurable (restrict origins in production).
- Environment secrets are read from `.env`, never hard-coded.

---

## 🖥️ VS Code Setup

1. Open the project folder: **File → Open Folder**
2. Install the **Python** extension by Microsoft.
3. Select the virtual environment interpreter:  
   `Ctrl+Shift+P` → *Python: Select Interpreter* → choose `venv`
4. Install the **REST Client** extension for in-editor API testing.
5. Recommended settings (`.vscode/settings.json`):
```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "editor.formatOnSave": true,
  "python.formatting.provider": "black"
}
```

---

## 🔄 Deactivate the virtual environment

```bash
deactivate
```
