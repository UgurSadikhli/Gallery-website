# Atelier: Art Gallery & Admin Dashboard

An interactive, multilingual digital exhibition for a painter, built with **Next.js (App Router)** and **PostgreSQL**. Every image is stored directly in the database as binary data (`BYTEA`) and streamed through native Route Handlers, so there is **no external storage service** (no S3, Cloudinary or Supabase) and **no upload library** (no Multer).

## Features

**Public gallery**
- Responsive masonry layout that preserves each painting's natural aspect ratio
- Animated "All works / For sale" filter (Framer Motion layout animations); the filter hides itself when nothing is for sale
- Hover overlay with title, medium and a "For sale" badge (always visible on touch devices)
- Anonymous likes with optimistic UI and a heart-pop animation, remembered in `localStorage`, protected by a per-painting cookie and per-IP rate limit
- Painting page with full-screen click-to-zoom lightbox, view counter, price and an "Inquire" button (`mailto:` pre-filled with the painting title)
- Dynamic OpenGraph / Twitter metadata, so shared links preview the actual painting
- Editorial "About" page with avatar, bio and contact links

**Admin dashboard** (`/admin`)
- Stateless JWT in an `HttpOnly` cookie (`jose`), single admin configured in `.env`
- Stat cards: total works, likes, views, works for sale
- Create, edit and delete paintings with a drag-and-drop image preview
- One-click "for sale" switch, price field, thumbnails
- Bio editor (three languages), contact email, Instagram link and avatar upload

**Experience**
- 3 languages: **Azerbaijani (default)**, **Russian**, **English**, chosen with a language switcher and remembered in a cookie
- Light and dark themes with no flash on load
- Fully responsive: mobile dropdown menu, card layout for the admin list on phones, full-screen edit modal
- Page transitions and micro-interactions throughout

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React 18 |
| Styling & motion | Tailwind CSS, Framer Motion, Lucide React |
| Database | PostgreSQL via `pg` (connection pool) |
| Auth | `jose` (JWT) + `bcryptjs` |
| Images | Native `request.formData()`, `file.arrayBuffer()`, `Buffer.from()` |
| Fonts | Cormorant Garamond + Inter (Latin, Latin-Extended, Cyrillic) |

## Getting started

### Prerequisites
- Node.js 18.17 or newer
- PostgreSQL 14 or newer

### 1. Install
```bash
git clone <your-repo-url>
cd <your-repo>
npm install
```

### 2. Create the database
```bash
createdb gallery
psql gallery -f schema.sql
```
(Upgrading an older install? Run `psql gallery -f migration_i18n.sql` once to add the Russian and English bio columns.)

### 3. Configure environment
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgres://user:pass@localhost:5432/gallery` |
| `JWT_SECRET` | Long random string (`openssl rand -base64 48`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password (**recommended**) |
| `ADMIN_PASSWORD` | Plain-text fallback for local development only (used if no hash is set) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for OpenGraph links) |
| `NEXT_PUBLIC_CURRENCY` | Currency code for prices, e.g. `USD`, `AZN`, `EUR` |

Generate a password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```
> In `.env`, escape every `$` in the hash as `\$` (Next.js expands variables).

### 4. Run
```bash
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

Admin panel: **http://localhost:3000/admin/login**

## Project structure

```
app/
  page.js                    # Home: hero + gallery
  painting/[id]/page.js      # Detail page + OpenGraph metadata
  about/page.js              # About the artist
  admin/                     # Login + dashboard
  api/
    paintings/               # Public list, image stream, like
    profile/avatar/          # Avatar stream
    admin/                   # Login, logout, paintings CRUD, profile
components/                  # Gallery, Hero, Navbar, PaintingView, admin/Dashboard, ...
lib/
  db.js                      # pg pool
  auth.js                    # JWT helpers (edge-safe)
  queries.js                 # Metadata queries (never select image_data)
  forms.js                   # Upload parsing and validation
  rateLimit.js               # In-memory rate limiter
  dictionaries.js            # AZ / RU / EN translations
  i18n-server.js             # Locale detection (cookie)
middleware.js                # Protects /admin and /api/admin
schema.sql                   # Database schema
```

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/paintings?for_sale=true` | Public | Paintings metadata (no image data) |
| GET | `/api/paintings/:id/image` | Public | Streams image bytes from PostgreSQL (cached) |
| POST | `/api/paintings/:id/like` | Public | Add a like (cookie + IP rate limit) |
| GET | `/api/profile/avatar` | Public | Streams the artist avatar |
| POST | `/api/admin/login` | Public | Sign in, sets `HttpOnly` JWT cookie |
| POST | `/api/admin/logout` | Admin | Clear the cookie |
| GET / POST | `/api/admin/paintings` | Admin | List with stats / upload painting |
| PUT / DELETE | `/api/admin/paintings/:id` | Admin | Update (optional new image) / delete |
| GET / PUT | `/api/admin/profile` | Admin | Read / update bio, contacts, avatar |

## Design notes

- **Performance:** list queries never fetch `image_data`. Images are only read inside the dedicated streaming handlers and cached by the browser (`Cache-Control: public, max-age=86400, stale-while-revalidate=3600`).
- **Uploads:** JPEG, PNG or WebP, up to 10 MB each, validated server-side.
- **Security:** `HttpOnly` cookie auth, bcrypt password check, login rate limiting, parameterised SQL queries, admin routes protected by middleware.

## Limitations

- The rate limiter is in memory, so it works for a single server instance (use Redis if you scale out).
- One admin account (configured in `.env`).
- Painting titles and descriptions are stored in a single language, while the UI and the About bio are trilingual.
- Storing images in PostgreSQL is simple and self-contained, but it grows the database; include it in your backups.

## Deployment checklist

- [ ] Strong `JWT_SECRET` and `ADMIN_PASSWORD_HASH` (not the plain password)
- [ ] `NEXT_PUBLIC_SITE_URL` set to your real domain (HTTPS)
- [ ] Hosted PostgreSQL with backups
- [ ] `.env` is **not** committed (it is in `.gitignore`)

## Author

**Ughur Sadikhli**: [sadikhli.ughur@gmail.com](mailto:sadikhli.ughur@gmail.com)
