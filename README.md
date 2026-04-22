# HealthPlanLocator Admin Dashboard

Next.js 14 App Router project for Medicare lead capture and admin CRM operations.

## Stack

- Next.js 14+
- Tailwind CSS
- MongoDB + Mongoose
- JWT cookie auth

## Setup

1. Copy `.env.example` to `.env.local`
2. Set `MONGODB_URI`, `JWT_SECRET`, and the official Jornaya script URL
3. Install dependencies
4. Run `npm run dev`

## Notes

- The public lead form includes a hidden `leadid_token` field for Jornaya auto-fill.
- IP address logging happens on the backend from request headers.
- Super Admin and Admin roles are managed inside the admin panel.
- The seeded Super Admin login is `admin@healthplanlocator.com` with password `Admin@12345` until you replace it.
