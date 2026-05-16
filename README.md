# DuckNotes

A simple personal notes app. No bloat, no distractions — just your thoughts in one place.

## What it does

- Sign up / log in with email & password
- Create, edit, and delete notes
- Each user only sees their own stuff
- JWT auth keeps sessions stateless

## Tech stack

- **Backend:** Flask, SQLAlchemy, Flask-JWT-Extended, SQLite
- **Frontend:** React (Vite), React Router

## Getting it running

You'll need Python 3 and Node.js installed.

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

API runs on http://localhost:5001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:5173

## Project structure

```
backend/
  app/
    __init__.py    - app factory, wires everything together
    config.py      - db uri, secret keys
    models.py      - User and Note tables
    auth.py        - signup/login endpoints
    notes.py       - CRUD endpoints for notes
  run.py           - entry point

frontend/
  src/
    config.js      - api base url (change if your port is different)
    App.jsx        - routing setup
    components/
      Login.jsx
      Signup.jsx
      Dashboard.jsx
      NoteForm.jsx
      NoteList.jsx
      ProtectedRoute.jsx
```

## Notes

- Default JWT expiry is 15 minutes (Flask-JWT-Extended default). Tweak `JWT_ACCESS_TOKEN_EXPIRES` in config if needed.
- SQLite file lives at `backend/ducknotes.db` — delete it to start fresh.
- CORS is wide open in dev. Lock it down before deploying anywhere real.
