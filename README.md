# Clinic Appointment Management System

A full-stack web application for a clinic to manage patients, doctors, and appointments. Its key business rule is that **a doctor can never be double-booked**: the API rejects overlapping appointments for the same doctor with a clear `409 Conflict` response.

## Features

- **Patients**: list, search, add, view, edit, delete
- **Doctors**: list, search, add, view, edit, delete
- **Appointments**: book, view, reschedule, cancel, delete, search by patient or doctor, filter by date
- **Conflict validation** on both create and reschedule
- **Dashboard** with totals and today's appointments
- **Consistent error responses** with proper HTTP status codes (400, 401, 403, 404, 409, 500)
- **Role-based access** (staff, doctor, patient) using JWT
- **Responsive UI** built with Tailwind CSS
- **Swagger API docs** at `/api-docs`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS v4 |
| Backend | Node.js, Express 5, JWT, bcrypt |
| ORM | Prisma 7 (with the `pg` driver adapter) |
| Database | PostgreSQL (hosted on Supabase) |
| API docs | Swagger (swagger-jsdoc + swagger-ui-express) |

## Project Structure

```
ClinicalAppManagement/
├── api/                      # Express REST API
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # SQL migrations
│   │   └── seed.js           # Demo data
│   └── src/
│       ├── routes/           # Route definitions (auth, staff, doctor, patient)
│       ├── controllers/      # Request/response handling
│       ├── services/         # Business logic (including conflict validation)
│       ├── guards/           # JWT auth and role guards
│       ├── middleware/       # Central error handler
│       └── config/           # Prisma, database, Swagger setup
└── web/                      # React frontend
    └── src/
        ├── pages/            # staff/, doctor/, patient/, auth/
        ├── components/       # Layouts and UI components
        └── lib/api.js        # API client
```

## Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database (a free [Supabase](https://supabase.com) project works)

## Setup

### 1. Install dependencies

```bash
cd api
npm install

cd ../web
npm install
```

### 2. Configure the API

Copy the example file and fill in your values:

```bash
cd api
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
```

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `TZ` | Timezone used for date-based search, for example `Asia/Kolkata` |
| `DATABASE_URL` | Pooled Postgres connection string, used by the running API |
| `DIRECT_URL` | Direct Postgres connection string, used by Prisma migrations |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `JWT_EXPIRES_IN` | Optional token lifetime (default `1d`) |

> Never commit your real `.env` file. It is listed in `.gitignore`.

### 3. Configure the frontend (optional)

The frontend calls `http://localhost:5000/api` by default. To use a different API URL, create `web/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Set up the database

From the `api` folder:

```bash
npx prisma generate
npx prisma migrate deploy
```

Optionally load demo data:

```bash
node prisma/seed.js
```

> **Warning:** the seed script first **deletes all existing users, patients, doctors, and appointments**. Only run it on a development database.

### 5. Run the app

Start the API (terminal 1):

```bash
cd api
npm run dev
```

Start the frontend (terminal 2):

```bash
cd web
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000
- Health check: http://localhost:5000/health
- Swagger docs: http://localhost:5000/api-docs

## Demo Accounts (after seeding)

All seeded accounts use the password `Password@123`. These are for local development only.

| Role | Email |
|---|---|
| Staff | `staff@test.com` |
| Doctor | `anil@clinic.com`, `priya@clinic.com`, `michael@clinic.com`, `sarah@clinic.com`, `lisa@clinic.com` |
| Patient | `shravya@example.com`, `kusuma@example.com`, `john@example.com`, `rajesh@example.com`, `maria@example.com` |

Log in as **staff** to manage patients, doctors, and appointments.

## API Overview

All routes except `/api/auth/*` and `/health` require an `Authorization: Bearer <token>` header. Staff routes require the `STAFF` role. Interactive docs are available at `/api-docs`.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/auth/signup` | Create a login account |

### Staff (`/api/staff`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard` | Totals and today's appointments |
| GET | `/patients?search=&page=&limit=` | List or search patients |
| POST | `/patients` | Create patient |
| GET | `/patients/:id` | Get patient |
| PUT | `/patients/:id` | Update patient |
| DELETE | `/patients/:id` | Delete patient (409 if they have appointments) |
| GET | `/doctors?search=&page=&limit=` | List or search doctors |
| POST | `/doctors` | Create doctor |
| GET | `/doctors/:id` | Get doctor |
| PUT | `/doctors/:id` | Update doctor |
| DELETE | `/doctors/:id` | Delete doctor (409 if they have appointments) |
| GET | `/appointments?date=YYYY-MM-DD&search=&doctorId=&status=&page=&limit=` | List, search, and filter appointments |
| POST | `/appointments` | Create appointment (with conflict check) |
| GET | `/appointments/:id` | Get appointment |
| PUT | `/appointments/:id` | Update, reschedule, or change status (with conflict check) |
| DELETE | `/appointments/:id` | Delete appointment |

The doctor and patient portals have their own routes under `/api/doctor` and `/api/patient` (dashboards, profiles, and each user's own appointments).

### Error responses

Every error uses the same shape:

```json
{ "success": false, "message": "Doctor already has an appointment during the selected time" }
```

| Status | Meaning |
|---|---|
| 400 | Validation failure (missing fields, invalid dates, end time not after start time, malformed JSON) |
| 401 | Missing, invalid, or expired token |
| 403 | Role not allowed |
| 404 | Record or route not found |
| 409 | Conflict: overlapping appointment, duplicate record, or record still in use |
| 500 | Unexpected server error (details are never exposed to the client) |

## Design Decisions

### Appointment conflict rule

Two appointments for the same doctor conflict when their time ranges overlap: an existing appointment conflicts with a new one if `existing.start < new.end` **and** `existing.end > new.start`.

- Back-to-back appointments (one ends exactly when the next starts) are allowed.
- Cancelled appointments do not block a time slot.
- When rescheduling, the appointment being edited is excluded from the check.
- The check runs on both create and update, and also validates that the patient and doctor exist and that the start time is before the end time.
- A database index on `(doctorId, startTime, endTime)` keeps this query fast.

### Delete and cancel behaviour

- **Cancel** an appointment by setting its status to `CANCELLED`. The record is kept for history and the slot becomes free.
- **Delete** an appointment removes the record permanently.
- **Deleting a patient or doctor** is blocked with `409` while they still have appointments, so history is never orphaned. The database foreign keys use `onDelete: Restrict` as a second safety net. When a patient or doctor with a linked login account is deleted, that login is removed too.

### Database

PostgreSQL with Prisma. The core tables are `Patient`, `Doctor`, and `Appointment`, plus a `User` table for logins. Appointments reference both patient and doctor through foreign keys. Indexes cover name and contact lookups, appointment date search, and the doctor/time conflict query.

### Architecture

Routes → controllers → services. Controllers only handle HTTP, services hold business rules, and one central error handler formats all errors. Services throw errors with a `statusCode`, and the handler also maps common Prisma errors (unique violation, foreign-key violation, record not found) to 409 or 404.

### Timezone

Date search interprets `YYYY-MM-DD` in the server's timezone. Set the `TZ` environment variable (for example `Asia/Kolkata`) wherever the API runs, including your hosting provider, so "today" matches your clinic's local day. The frontend sends appointment times as full ISO timestamps to avoid ambiguity.

## Deployment Notes

- Set all the environment variables from the table above on the host, including `TZ`.
- Run `npx prisma migrate deploy` as part of the release step.
- Start the API with `npm start`.
- Build the frontend with `npm run build` in `web` and set `VITE_API_URL` to the deployed API URL before building.
- The API enables CORS for all origins by default. Restrict it to your frontend URL in production.

## Known Limitations and Future Work

- **Concurrent bookings:** the conflict check reads existing appointments and then inserts. Two requests at exactly the same moment could both pass. A database exclusion constraint or a serializable transaction would remove this gap.
- **Automated tests:** not included yet. Planned: API tests for the conflict rule (overlap, back-to-back, cancelled slots, reschedule).
- **List pagination in the UI:** the API supports pagination, but the patient and doctor lists do not show page controls yet.

## Screenshots

_Add screenshots of the completed application here (dashboard, patient list, doctor list, appointment booking, appointment conflict error, mobile view)._