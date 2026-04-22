# HealthPlanLocator Admin Dashboard

A Next.js 14 lead capture and CRM app for Medicare quote requests.

The project has two main parts:

- A public Medicare form that collects lead data
- A private admin dashboard for reviewing, filtering, exporting, and managing leads and admins

It also includes backend IP logging, Jornaya lead ID capture, CSV export, JWT cookie auth, and free geolocation lookup through `ip-api.com`.

## What This App Does

1. Shows a public quote request form
2. Captures lead details and consent
3. Reads the Jornaya `leadid_token` hidden field when available
4. Captures the request IP on the backend
5. Looks up free geo data from `ip-api.com`
6. Stores the submission in MongoDB
7. Redirects the user to a thank-you page
8. Lets admins review leads in the dashboard
9. Lets admins create, disable, and manage admin users
10. Exports lead data as CSV

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- `jose` for JWT auth
- `bcryptjs` for password hashing
- `zod` for validation
- `csv-stringify` for export
- `recharts` for dashboard charts

## Project Structure

- `app/`
  - Public pages, admin pages, and API routes
- `components/`
  - Reusable UI and dashboard components
- `lib/`
  - Auth, validation, utilities, IP capture, geolocation, and database helpers
- `models/`
  - Mongoose models for leads and admins
- `services/`
  - Business logic for leads and admins
- `types/`
  - Shared TypeScript types

## Main Routes

### Public Pages

- `/` - Public Medicare lead form
- `/thank-you` - Confirmation page after successful submission
- `/privacy-policy` - Privacy policy page
- `/terms-of-use` - Terms page

### Admin Pages

- `/admin/login` - Admin sign-in
- `/admin/dashboard` - Metrics and charts
- `/admin/leads` - Lead list, filters, and actions
- `/admin/leads/[id]` - Lead detail view
- `/admin/admin-management` - Admin user management
- `/admin/settings` - App settings

### API Routes

- `POST /api/leads` - Create a public lead
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/leads` - List leads for the dashboard
- `GET /api/admin/leads/export` - Export leads as CSV
- `GET/PATCH/DELETE /api/admin/leads/[id]` - Lead detail actions
- `GET/POST /api/admin/admins` - Admin user management

## How Lead Capture Works

1. The user fills out the public form on `/`
2. The hidden Jornaya field `leadid_token` is included in the form
3. The browser submits the form to `POST /api/leads`
4. The API validates the form with Zod
5. The API reads the IP from request headers on the backend
6. The API enriches the IP with free geolocation data from `ip-api.com`
7. The lead is saved to MongoDB
8. The API returns the lead ID and Jornaya ID
9. The user is redirected to `/thank-you`

## IP Handling

The app does not trust the frontend for IP data.

IP is read on the backend from request metadata using these sources in order:

- `x-forwarded-for`
- `x-vercel-forwarded-for`
- `x-real-ip`
- `x-client-ip`
- `cf-connecting-ip`
- `true-client-ip`
- `fastly-client-ip`
- `x-cluster-client-ip`
- `x-appengine-user-ip`
- `forwarded`
- socket or connection remote address

### Important Notes About IP

- On localhost, you will often see `::1` or `127.0.0.1`
- In local development, that is normal
- On a real deployment behind a proxy, you should get the public client IP
- If no usable IP is available, the app stores `unknown`

## Free Geolocation

The app uses `ip-api.com` for free geolocation lookup.

Stored geo fields:

- `country`
- `city`
- `state_province`
- `zipcode`
- `isp`
- `timezone`

### Geolocation Behavior

- If the lookup succeeds, the geo fields are stored on the lead
- If the lookup fails, the lead still saves
- Geo lookup is optional and should never block lead creation

## Jornaya Integration

The public form includes:

```html
<input type="hidden" name="jornaya_lead_id" id="leadid_token" />
```

The app expects the Jornaya script to populate that field automatically.

If the Jornaya token is missing:

- the app falls back to the generated reference ID
- the lead still submits successfully

That means the app keeps working, but the value shown as Jornaya Lead ID may be the fallback reference ID if the vendor script is not installed or not firing.

## Database Models

### Lead

The lead record stores:

- first and last name
- date of birth
- ZIP code
- state
- gender
- phone
- email
- Jornaya lead ID
- IP address
- geo data
- user agent
- landing page URL
- UTM source and campaign
- status
- insurance type
- notes

### Admin

The admin record stores:

- name
- email
- password hash
- role
- status
- last login

## Authentication

Admin auth uses:

- password hashing with `bcryptjs`
- signed JWTs with `jose`
- an `admin_token` cookie
- middleware protection for admin routes

Protected areas:

- `/admin/dashboard`
- `/admin/leads`
- `/admin/admin-management`
- `/admin/settings`
- admin API routes under `/api/admin/*`

## Environment Variables

Create a `.env.local` file with these values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_JORNAYA_SCRIPT_SRC=https://example.com/jornaya.js
NEXT_PUBLIC_APP_NAME=HealthPlanLocator
NEXT_PUBLIC_SUPPORT_PHONE=1-800-555-0123
```

### Notes on env vars

- `MONGODB_URI` is required
- `MONGO_URL` or `DATABASE_URL` also work as aliases
- `JWT_SECRET` is required for secure admin auth
- `NEXT_PUBLIC_JORNAYA_SCRIPT_SRC` is optional, but needed for real Jornaya capture
- `NEXT_PUBLIC_SUPPORT_PHONE` controls the support phone shown in the UI
- The app currently uses free `ip-api.com` for geolocation, so no paid IP geo key is required

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy the environment file

```bash
copy .env.example .env.local
```

3. Fill in the required values

4. Run the development server

```bash
npm run dev
```

5. Open the app in your browser

```bash
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

### Windows note

If `next build` fails with a worker spawn permission error on Windows, try:

- running the terminal as administrator
- checking antivirus or endpoint security restrictions
- using a different shell or machine for the build step

The code itself can still be valid even if the local Windows worker process is blocked.

## Useful Files

- [app/page.tsx](./app/page.tsx) - public landing page and Jornaya script injection
- [components/public-medical-form.tsx](./components/public-medical-form.tsx) - public lead form
- [app/api/leads/route.ts](./app/api/leads/route.ts) - public lead submission API
- [lib/ip.ts](./lib/ip.ts) - backend IP capture logic
- [lib/ipgeolocation.ts](./lib/ipgeolocation.ts) - free IP geo lookup
- [services/lead-service.ts](./services/lead-service.ts) - lead database operations
- [models/Lead.ts](./models/Lead.ts) - MongoDB lead schema
- [app/admin/leads/page.tsx](./app/admin/leads/page.tsx) - lead list view
- [app/admin/leads/[id]/page.tsx](./app/admin/leads/[id]/page.tsx) - lead detail page

## Common Troubleshooting

### IP shows as `unknown`

This usually means:

- you are running locally and the request has no public IP
- your deployment is not forwarding the right headers
- the request is coming from a proxy that hides the original client IP

### IP shows as `::1`

That is normal in local development. It is the IPv6 loopback address for localhost.

### Jornaya ID is blank

That means the Jornaya vendor script did not populate `leadid_token`.

### Geo fields are empty

That can happen when:

- the IP lookup fails
- the IP is local or private
- the `ip-api.com` free service rate limits or rejects the request

## Security and Data Notes

- IPs are captured on the server, not the browser
- Admin routes are protected by middleware
- Lead submissions are validated with Zod
- Passwords are hashed before storage
- Geo lookup failures do not block the form

## License

No license file is included yet. Add one if you plan to share or publish the project.
