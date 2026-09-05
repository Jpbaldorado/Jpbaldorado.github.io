# JPB Portfolio

Personal portfolio for **John Patrick Baldorado** — Network Engineer, Philippines.

Two independent codebases:

```
frontend/   React 18 + Vite + Tailwind CSS
backend/    FastAPI (Python 3.11+)
```

They talk over one JSON API. Neither imports from the other, so either side can be
deployed, replaced, or scaled on its own.

---

## Running it locally

Two terminals. Start the backend first — the frontend proxies to it.

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: <http://127.0.0.1:8000/docs> (disabled when `APP_ENV=production`).

Tests:

```bash
pytest -q      # 8 tests: validation, rate limiting, honeypot, content, CV handle
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

`vite.config.js` proxies `/api` to `127.0.0.1:8000` in development, so the browser
stays same-origin and CORS never enters the picture locally. For a separately
hosted API in production, set `VITE_API_BASE_URL` in `frontend/.env`.

---

## API

| Method | Path           | Purpose                                    |
| ------ | -------------- | ------------------------------------------ |
| GET    | `/api/health`  | Liveness, plus which mail transport is live |
| GET    | `/api/profile` | Full portfolio content as JSON             |
| GET    | `/api/cv`      | CV download                                |
| POST   | `/api/contact` | Contact form submission                    |

### How the contact endpoint behaves

- **Stores before it sends.** Every submission is appended to
  `data/submissions.jsonl` *before* any delivery attempt. A mail outage costs
  delivery, never data — replay the file when SMTP is back.
- **Sends after responding.** SMTP runs in a `BackgroundTask`, so a slow handshake
  never holds the visitor's browser open.
- **Rate limited.** Fixed window, 5 submissions per IP per hour by default. Returns
  `429` with a `Retry-After` header. The limiter is in-process; behind multiple
  workers or replicas, swap `RateLimiter`'s backing store for Redis — it is the only
  interface callers depend on.
- **Honeypot.** A hidden `website` field. Filled in means bot: the API returns a
  normal `201` so there is nothing to tune against, and drops the submission
  without storing or delivering it.
- **Validated twice.** Pydantic rules on the server mirror the checks in the React
  form, so a bypassed client cannot get past the same constraints. FastAPI's `422`
  payload is mapped back onto individual form fields by `src/lib/api.js`.

Leave `SMTP_HOST` empty and the API runs in **log-only mode** — submissions are
stored and logged but never emailed. That is the default, so development and CI
need no mail credentials.

---

## Theme system

The brief called for a flash-free toggle. That needs two things working together,
and neither is sufficient alone:

1. **An inline script in `index.html`** reads the stored preference and sets the
   class on `<html>` *before first paint*. Without it the page renders one frame in
   the default theme and then snaps — the flash.
2. **`ThemeProvider` initialises from the DOM**, not from `localStorage`. Reading
   the class the script already committed guarantees React's first render agrees
   with what the browser has painted, so mounting cannot cause a second flip.

Every colour is a CSS variable (`--c-canvas`, `--c-accent`, …) mapped into Tailwind
as `rgb(var(--c-x) / <alpha-value>)`. A theme switch changes one class on `<html>`
and the browser repaints; React does not re-render against a second set of `dark:`
utilities. Only paint properties transition — layout and text stay pinned, so the
switch reads as a re-light of the same page.

The toggle also follows the OS preference, but only until the visitor makes an
explicit choice. After that, their choice wins.

> **A naming trap worth knowing about.** The canvas colour token is called `canvas`,
> not `base`. Tailwind generates colour and font-size utilities under the same
> `text-` prefix, so a colour named `base` collides with the built-in `text-base`
> font size and silently paints every body-copy element in the background colour.
> Same applies to `sm`, `lg`, `xl`. Avoid those names for colours.

---

## Design

Palette follows the brief exactly. Dark is charcoal `#1E1E1E` with teal `#008080`
and a neon-green link-status signal; light is a corporate scheme of slate frames,
navy ink, and royal blue. In light mode the `signal` token resolves to royal blue —
neon green on white is unreadable, and the LED still needs to mean "active."

Type is IBM Plex Sans with IBM Plex Mono, chosen because Plex was drawn for
infrastructure documentation. The mono carries interface data — port counts, date
stamps, tags, section indices — while the sans carries prose.

The layout concept is a **patch panel**: hairline frames, near-square corners, no
drop shadows anywhere, and a fixed left rail of section markers with link-status
LEDs that light as you scroll. Depth comes from frame colour, the way rack hardware
reads. Boldness is spent in one place — the metrics strip, built as a single rack
unit with a teal top rail and three bays, rather than three floating cards.

Quality floor: responsive to 390px, visible keyboard focus, `prefers-reduced-motion`
respected, ARIA tabs and carousel patterns with roving focus and arrow-key support.

---

## Before this goes live

1. **Replace the placeholder links.** `linkedin`, `github`, and `email` in
   `frontend/src/data/portfolio.js` and `backend/app/data/profile.py` were inferred
   from the name pattern and are almost certainly wrong.
2. **Add the CV.** Drop the PDF at `backend/app/assets/John-Patrick-Baldorado-CV.pdf`.
   Until then `/api/cv` returns a 404 that names the missing path rather than a bare
   error.
3. **Set real SMTP credentials** and a real `CONTACT_RECIPIENT` in `backend/.env`.
4. **Lock down CORS.** `CORS_ORIGINS` must list the production domain only.
5. **Set `APP_ENV=production`** to disable the interactive API docs.

### Deploying

```bash
cd frontend && npm run build     # -> frontend/dist, ~56 kB gzipped JS
```

Serve `dist/` from any static host or CDN. Run the API under a process manager:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Put both behind one reverse proxy — static files at `/`, the API at `/api` — and the
frontend needs no `VITE_API_BASE_URL` at all. If you do run more than one worker,
move the rate limiter to a shared store first; per-process windows multiply the
effective limit by the worker count.

Content lives in exactly two files (`portfolio.js` and `profile.py`, same shape).
`/api/profile` exists so the site can later be driven from the API — or a CMS behind
it — without touching a single component.
