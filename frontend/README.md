# 🛡 CipherGuard – Password Strength Analyzer Frontend

A professional cybersecurity-themed React dashboard that connects to a Flask backend API and provides real-time password strength analysis with entropy calculation, security scoring, and history tracking.

---

## ✨ Design Direction

**Aesthetic**: Retro-futuristic military terminal meets modern glassmorphism  
**Fonts**: Orbitron (display) + Rajdhani (body) + JetBrains Mono (code)  
**Colors**: Deep navy voids · Neon cyan accents · Bio-green success · Emergency red · Amber warnings  
**Motion**: Scanline sweep · Segment bar fills · Entropy ring animation · Staggered fade-ups · Toast slides

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx           — Fixed nav with live API status dot
│   ├── PasswordInput.jsx    — Input with show/hide, copy, generate
│   ├── StrengthMeter.jsx    — 4-segment bar + SVG entropy ring
│   ├── PasswordChecklist.jsx — Animated pass/fail rule checklist
│   ├── SuggestionsPanel.jsx  — Improvement suggestions list
│   ├── PasswordHistory.jsx   — Saved password metadata cards
│   ├── Loader.jsx            — Dots, page loader, skeleton
│   └── Footer.jsx            — Site footer
│
├── pages/
│   ├── Dashboard.jsx         — Main analysis page
│   ├── History.jsx           — Filterable history table
│   └── About.jsx             — Project docs + API reference
│
├── services/
│   └── api.js               — Axios service layer (all backend calls)
│
├── styles/
│   └── animations.css       — Extra keyframe library
│
├── App.jsx                  — Router + layout shell
├── main.jsx                 — React entry point
└── index.css                — Global styles + CSS variables
```

---

## ⚙️ Setup

### Prerequisites
- Node.js ≥ 18
- Flask backend running at `http://127.0.0.1:5000`

### Install & Run

```bash
# 1. Navigate to project
cd password-strength-analyzer-frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

---

## 🌐 Environment Variables

Create `.env.local` in the project root:

```env
VITE_API_URL=http://127.0.0.1:5000
```

---

## 📡 API Integration

| Method   | Endpoint             | Usage                          |
|----------|----------------------|--------------------------------|
| `POST`   | `/analyze-password`  | Real-time analysis (debounced) |
| `POST`   | `/save-password`     | Hash + persist password        |
| `GET`    | `/password-history`  | Load saved records             |
| `DELETE` | `/clear-history`     | Wipe all records               |
| `GET`    | `/health`            | Backend liveness check         |

---

## 🧩 Component Guide

### `PasswordInput`
Handles all input-related interactions: show/hide toggle, clipboard copy, clear, and the generate strong password button. Color-codes the input border based on current strength.

### `StrengthMeter`
Two visualisations:
- **4-segment bar** — one segment lights up per strength level
- **SVG entropy ring** — circular gauge from 0–128 bits, animates on update

### `PasswordChecklist`
Renders pass/fail for: length, uppercase, lowercase, numbers, special characters, not-common. Uses staggered fade animations.

### `SuggestionsPanel`
If the backend returns suggestions, renders each as an orange numbered card. Shows a green "OPTIMAL SECURITY" state when no suggestions exist.

### `PasswordHistory`
Shows saved record cards with score bars, entropy, and timestamps. Includes a two-click confirm delete.

---

## 🖥️ VS Code Setup

1. Open folder: `File → Open Folder → password-strength-analyzer-frontend`
2. Install extensions:
   - **ES7+ React/Redux/React-Native snippets**
   - **Tailwind CSS IntelliSense**
   - **Prettier – Code formatter**
   - **REST Client** (for API testing)
3. `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]]
}
```

---

## 🔒 Security Notes

- Passwords are sent over HTTPS in production (use a proxy like Nginx)
- No passwords are stored in localStorage or sessionStorage
- The API service strips sensitive fields before returning history
- All API errors surface a `friendlyMessage` via Axios interceptors

---


