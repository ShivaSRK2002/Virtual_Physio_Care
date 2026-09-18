# Virtual Physio Care

Marketing + enquiry website for an online physiotherapy service serving patients in India
and abroad. Built with React + Vite. The Contact page uses a custom booking form that
submits to a Vercel API endpoint.

On each submission:
- the customer receives a success/confirmation email
- the clinic receives a new-booking notification email
- submission data is appended to Google Sheets for tracking/export

## Pages

- **Home** — hero, online/home-visit paths, services overview, how-it-works, benefits,
  Chennai service-area map, testimonials, FAQ
- **About** — story, values
- **Services** — full breakdown of physiotherapy services offered
- **Blog** — SEO articles targeting real search terms ([src/data/blogPosts.js](src/data/blogPosts.js))
- **Contact** — contact details + in-app booking/enquiry form
- **Privacy Policy** — required for Google/Meta ads and basic patient-data trust

## One-time setup: custom booking form backend

### 1) Create and prepare Google Sheet for booking data

1. Create a Google Sheet and name one tab `Bookings`.
2. Add header columns in row 1 (A to J):
   - submission_id
   - submitted_at
   - full_name
   - email
   - phone
   - country
   - age
   - gender
   - service_type
   - message
3. Copy the Sheet ID from the URL:
   - `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`

### 2) Create Google service account and share sheet

1. Open Google Cloud Console and create a project (or use existing).
2. Enable Google Sheets API for that project.
3. Create a Service Account and generate a JSON key.
4. Copy the service account email from JSON and share the Google Sheet with that email as Editor.
5. Copy the `private_key` value from the JSON for environment variable setup.

### 3) Set up email sending (Resend)

1. Create a Resend account.
2. Verify your sending domain and create a sender email (for example, `bookings@yourdomain.com`).
3. Create an API key.

### 4) Add environment variables in Vercel project settings

Set these variables:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CLINIC_NOTIFICATION_EMAIL`
- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_BOOKING_SHEET_NAME` (optional, defaults to `Bookings`)

Important for `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`:
- store it with escaped newlines (`\n`) if you paste in one line

### 5) Update contact details

Update phone/email/Instagram details in [src/config.js](src/config.js).

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy it to any static host — Netlify, Vercel, GitHub Pages, or
your own hosting.

## API endpoint

- Endpoint: `POST /api/bookings`
- Handler: [api/bookings.js](api/bookings.js)
- Payload fields:
   - fullName, email, phone, country, age, gender, serviceType (required)
   - message (optional)

**Important:** this site uses client-side routing (React Router) with pages like `/blog/some-post`.
Most static hosts need an explicit rewrite rule so that any unknown path serves `index.html`
(otherwise refreshing or directly visiting `/blog/...` returns a 404). Netlify and Vercel both
detect Vite/SPA projects automatically in most cases, but if you hit 404s on deep links:
- **Netlify:** add a `public/_redirects` file containing `/*  /index.html  200`
- **Vercel:** add a `vercel.json` with a rewrite of all paths to `/index.html`
- **GitHub Pages:** needs an extra workaround (e.g. a 404.html redirect trick) since it doesn't
  support server-side rewrites at all.

## Future enhancements (not implemented yet)

- Online payment (Razorpay for India, Stripe/PayPal for international clients)
- SMS/WhatsApp notifications on new enquiries
- Google Analytics 4 / Meta Pixel / Google Ads conversion tracking
- Google Business Profile listing for Chennai local search
- Real therapist bios/photos and verified Google Reviews widget
