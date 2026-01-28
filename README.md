# Seattle Tabla Institute Website

## Summary
Static, mobile-first website for Seattle Tabla Institute (STI) with a lightweight
CMS (Decap CMS) for non-developer updates. Content for events, classes, and the
media gallery is managed via Markdown and JSON files in the repo and deployed
on Netlify.

## Overview
- Static HTML/CSS/JS site with fast load times and mobile-friendly layouts.
- Decap CMS (Netlify CMS) enables non-developers to update:
  - Events (Markdown)
  - Class schedules/pricing (JSON)
  - Gallery photos and YouTube links (JSON)
- Netlify build script compiles event Markdown into `data/events.json`.
- Netlify Identity + Git Gateway handle editor authentication and commits.

## Architecture
```mermaid
flowchart LR
  Editor[Editor via /admin] --> Google[Google Sign-in]
  Google --> Auth0[Auth0 Tenant]
  Auth0 --> Functions[Netlify Functions Auth]
  Functions --> Token[GitHub Token]
  Token --> Repo[Git Repository]
  Repo --> Build[Netlify Build: npm run build]
  Build --> Static[Static Site Output]

  Repo --> EventsMD[content/events/*.md]
  Repo --> ClassesJSON[data/classes.json]
  Repo --> GalleryJSON[data/gallery.json]
  Build --> EventsJSON[data/events.json]
  Static --> Browser[Site Visitors]
  Browser --> DataFetch[Fetch JSON data files]
```

## Local Setup
Install dependencies:
```bash
npm install
```

Build event data:
```bash
npm run build
```

Preview locally:
```bash
python3 -m http.server
```
Open `http://localhost:8000`.

## Content Locations
- Events (Markdown): `content/events/`
- Events output (JSON): `data/events.json` (generated)
- Class data (JSON): `data/classes.json`
- Gallery data (JSON): `data/gallery.json`
- CMS config: `admin/config.yml`
- CMS entry: `admin/index.html`

## Netlify CMS Setup
This project uses Auth0 (Google sign-in) + Netlify Functions for CMS auth.

1) Create an Auth0 Regular Web App and enable Google as a social connection.
2) Set Auth0 callbacks:
   - `https://<your-site>.netlify.app/.netlify/functions/auth-callback`
   - `http://localhost:8000/.netlify/functions/auth-callback`
3) Set Auth0 web origins and logout URLs:
   - `https://<your-site>.netlify.app`
   - `http://localhost:8000`
4) Add Netlify environment variables (see `.env.example`).
5) Deploy and log in at `/admin/` with Google.

## Notes
- Update PayPal links when ready.
- Replace gallery placeholders in `assets/uploads/`.
