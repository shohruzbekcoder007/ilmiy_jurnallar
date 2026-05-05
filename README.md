# ziyonashrmedia

ziyonashrmedia — Scientific Journals Platform.

Full-stack (Node.js + Express + MongoDB + React + Vite) with multilanguage UI (UZ / RU / EN),
JWT auth, role-based access (author / reviewer / editor / admin), Cloudinary file uploads,
double-blind review workflow, and email notifications.

---

## Repository layout

```
backend/   Express REST API (Mongoose, JWT, Cloudinary, Nodemailer)
frontend/  React + Vite SPA (Tailwind, react-i18next, react-query)
```

## Prerequisites

- Node.js >= 18
- MongoDB >= 6 (local or Atlas)
- Cloudinary account (for PDF / image uploads)
- SMTP credentials (optional — emails fall back to console log if missing)

---

## 1. Backend setup

```bash
cd backend
cp .env.example .env       # then edit values
npm install
npm run seed               # creates demo admin / editor / reviewer / author + sample data
npm run dev                # runs on http://localhost:5000
```

### Seeded accounts

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| admin    | admin@journal.uz       | Admin123!    |
| editor   | editor@journal.uz      | Editor123!   |
| reviewer | reviewer@journal.uz    | Reviewer123! |
| author   | author@journal.uz      | Author123!   |

### API base URL

`http://localhost:5000/api/v1`

Health: `GET /api/v1/health`

### Key route groups

| Path             | Description                                          |
|------------------|------------------------------------------------------|
| `/auth/*`        | register, login, refresh, logout, me, password reset |
| `/journals/*`    | CRUD journals, list issues / articles by slug        |
| `/issues/*`      | CRUD issues                                          |
| `/articles/*`    | submit, list, status changes, publish, timeline      |
| `/reviews/*`     | submit reviews, my reviews, assigned to me           |
| `/users/*`       | admin user management, author search                 |
| `/announcements/*` | news / call for papers / conferences               |
| `/stats/*`       | summary, admin charts, unified search                |
| `/upload/*`      | PDF + image upload (Cloudinary)                      |

---

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env       # optional: override VITE_API_URL
npm install
npm run dev                # runs on http://localhost:5173
```

`vite.config.js` proxies `/api` to `http://localhost:5000`, so the dev server
can run without CORS configuration.

### Routes

| Path                          | Page                                           |
|-------------------------------|------------------------------------------------|
| `/`                           | HomePage (hero, stats, featured journals)      |
| `/jurnallar`                  | All journals + filters                         |
| `/jurnallar/:slug`            | Journal detail with editorial board + issues   |
| `/maqolalar`                  | Articles list with sidebar filters             |
| `/maqolalar/:id`              | Article detail (multilang abstract, citations) |
| `/imrad`                      | IMRAD guide                                    |
| `/elon`, `/elon/:id`          | Announcements                                  |
| `/aloqa`                      | Contact page                                   |
| `/search?q=`                  | Unified search                                 |
| `/login`, `/register`         | Authentication                                 |
| `/cabinet/*`                  | Author dashboard (multi-step submit form)      |
| `/editor/*`                   | Editor dashboard (assign reviewers, publish)   |
| `/admin/*`                    | Admin (journals, users, announcements, stats)  |

---

## 3. Multilanguage (i18n)

- Static UI strings: `frontend/src/i18n/{uz,ru,en}.json`
- Dynamic content (titles, descriptions, abstracts, announcements) is stored
  in MongoDB as `{ uz, ru, en }` and rendered via the `pickI18n()` helper
  based on the active language.
- Language switcher in the navbar persists the choice in `localStorage`
  and forwards it to the backend via `Accept-Language`.

---

## 4. Security

- bcrypt (cost 12) for passwords
- JWT access token (15 min) + httpOnly refresh cookie (7 days)
- Helmet, CORS allowlist, rate limiting (general + stricter on `/auth`)
- express-validator on every write route
- Multer file upload restricted to PDF (article) / image (cover) by mimetype + extension
- Double-blind reviews (reviewer info stripped on author-facing emails)
- All required env vars validated at startup

---

## 5. Email notifications

Triggered automatically:

- registration → welcome
- article submitted → confirmation to author + editor notice
- reviewer assigned → invitation
- review submitted → editor notice
- accepted / rejected / revision requested → author notice
- published → DOI + issue link

If SMTP is not configured, emails are logged to console (mock mode).

---

## 6. Production notes

- Set `NODE_ENV=production`, configure real SMTP, and set proper `CLIENT_ORIGIN`.
- Build the frontend with `npm run build` and serve `dist/` via any static host
  (or behind the same reverse proxy as the API).
- Rotate `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` and keep them out of git.
- Cloudinary credentials must be present for PDF / image uploads to succeed.

---

## License

Educational / institutional use.
