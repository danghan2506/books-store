# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack book e-commerce app. The repo is a manual monorepo (not npm workspaces): `backend/` (Express + MongoDB) and `frontend/` (React 19 + Vite + TypeScript) each have their own `package.json` and must be installed separately. The root `package.json` only orchestrates running both.

## Commands

Run from the repo root unless noted. Each package needs `npm install` independently (root, `backend/`, `frontend/`).

| Command | Description |
| :--- | :--- |
| `npm run dev` | Run backend + frontend concurrently (most common) |
| `npm run backend` | Backend only, via `nodemon backend/index.js` |
| `npm run frontend` | Frontend only (`vite`, port 5173) |
| `cd frontend && npm run build` | Type-check (`tsc -b`) then production build |
| `cd frontend && npm run lint` | ESLint over `frontend/` |

There is no test suite (`npm test` is a placeholder that exits 1).

The backend entry loads env with `config({path: './backend/.env'})`, so it expects to be launched from the repo root — running `node index.js` from inside `backend/` will not find the `.env`.

## Environment

Two env files are required (see `backend/.env.example`, `frontend/.env.example`):
- `backend/.env` — `DATABASE_URI`, `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY`, Cloudinary keys, `PAYPAL_CLIENT_ID`, `EMAIL_USER`/`EMAIL_PASS` (Gmail app password for Nodemailer), `CLERK_*`, `FRONTEND_URL`, `NODE_ENV`.
- `frontend/.env` — `VITE_REACT_APP_BACKEND_BASEURL` (leave empty for local dev), `VITE_USERS_URL`, `VITE_BOOKS_URL`, `VITE_ORDERS_URL`, `VITE_AUTH_URL`, `VITE_PAYPAL_URL`, `VITE_CLERK_PUBLISHABLE_KEY`.

`NODE_ENV` toggles cookie behavior: production sends `secure: true` + `sameSite: 'none'` (required for cross-site cookies); dev uses `lax`/non-secure.

## Architecture

### Backend (`backend/`, ES modules, Express 5)

Request pipeline per API route: `cors` (origin allow-list incl. `FRONTEND_URL` + localhost, `credentials: true`) → `express.json`/`urlencoded` → `cookieParser` → request logger → **`ensureDatabaseConnection`** → router → `errorHandler` (must stay last).

- **Serverless-aware DB connection.** `config/connect-database.js` caches the Mongoose connection on `global.mongooseConnectionCache` and `database-middleware.js` re-verifies/reuses it on every request. This pattern exists because the app deploys to a serverless target (`serverless-http`, and `index.js` `export default app`). Do not move connection setup to a one-time call at boot.
- **Layering.** `routes/` → `controllers/` (business logic) → `models/` (Mongoose schemas: Book, Order, User). Helpers in `utils/` (token, slug, cloudinary, orders), cross-cutting in `middlewares/`.
- **Async errors.** Controllers wrap handlers in `middlewares/async-handler.js` (`Promise.resolve(fn).catch(next)`) so thrown errors reach `errorHandler`, which returns `{ success, message, stack }` (stack nulled in production). Set `err.statusCode` (or `res.status(...)`) before throwing to control the HTTP code.
- **Auth model (custom JWT, stateful refresh).** `utils/create-token.js` issues a short-lived `accessToken` and a 7-day `refreshToken`, persists the refresh token on the user doc, and sets both as httpOnly cookies. NOTE: despite "15 mins" comments, the access token is currently signed with `expiresIn: "1m"`. `middlewares/auth-middleware.js` exposes `authenticate` (reads `accessToken` cookie, attaches `req.user`) and `authorizedAdmin` (checks `req.user.role === "admin"`).
- **Clerk** is used only for Google sign-in: `POST /api/auth/login-with-google` is gated by `ClerkExpressRequireAuth`, then `loginWithClerk` issues the app's own JWT cookies. Everything else uses the custom JWT flow.
- **Rate limiting** (`express-rate-limit`, 5 req / 15 min) is currently applied only to `GET /api/config/paypal`, not the auth routes.
- **File uploads** are inconsistent by route: book creation uses `multer` (`upload.array("images")` → Cloudinary), while book update uses `express-formidable`. Match the existing middleware when editing a given route.
- API surface is mounted under `/api/users`, `/api/books`, `/api/orders`, `/api/auth`.

### Frontend (`frontend/src/`, React 19, TS)

- **Routing** is defined centrally in `main.tsx` (`createBrowserRouter`). Three route groups: public auth pages (`/login`, `/signup`, reset-password flow); admin under `/admin` wrapped by `AdminRoute` → `AdminLayout`; user app under `/` wrapped by `App` (which renders the shared `Header`) and `PrivateRoutes`. Provider nesting at the root: Redux `Provider` → `PayPalScriptProvider` → `ClerkProvider` → `RouterProvider`.
- **State / data fetching: RTK Query.** `redux/API/api-slice.ts` is the single base API (`tagTypes: ["User","Book","Order"]`) with an **empty** `endpoints` object. Each feature file (`auth-api-slice.ts`, `book-api-slice.ts`, `order-api-slice.ts`, `user-api-slice.ts`) extends it via `apiSlice.injectEndpoints(...)` and re-exports the generated hooks. Add new endpoints by injecting into an existing or new feature slice — never define them directly on the base slice.
- **Auto token refresh.** The base query (`baseQueryWithReauth`) sends cookies (`credentials: "include"`); on a `401` it POSTs `/api/auth/refresh` once and retries the original request, dispatching `logout()` if refresh fails. This is what makes the 1-minute access token transparent to the UI.
- **Client-only state** lives in plain slices: `auth` (mirrors `userInfo` to `localStorage`), `cart`, `favourites`. Favourites are namespaced per user in localStorage (key `favourites_${userId}`) and managed through the `useFavourites` hook — see `FIXES.md` for the rationale; do not revert to a global favourites key or `localStorage.clear()`.
- **URL config.** `redux/features/constants.ts`: `BASE_URL` is `""` in dev (so requests go through Vite's `/api` proxy to `localhost:5000`) and falls back to the deployed backend URL in production. The other `*_URL` constants come from `VITE_*` env vars and are prefixed onto endpoint paths.
- **UI stack.** shadcn/ui ("new-york" style) components in `components/ui/` (config in `components.json`), Tailwind v4 (via `@tailwindcss/vite`, no JS config file), Radix primitives, MUI, Framer Motion. Path alias `@` → `src/`. Charts use both ApexCharts and Chart.js. Toasts use `sonner`.

## Conventions

- Files are kebab-case (`books-controller.js`, `auth-api-slice.ts`); RTK Query slices export auto-generated `use*` hooks.
- Inline comments and some user-facing strings are in Vietnamese — match the surrounding language when editing a file.
- `FIXES.md` documents past bug fixes (favourites isolation, image null-safety) and the invariants they established.
