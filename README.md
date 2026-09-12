# Virtual Physio Care

Marketing + enquiry website for an online physiotherapy service serving patients in India
and abroad. Built with React + Vite, deployed on Vercel. Enquiries are submitted through a
real form on the Contact page, handled by a small serverless function
([api/submit-enquiry.js](api/submit-enquiry.js)) that:

1. Appends the enquiry as a new row in a Google Sheet you control.
2. Emails the patient a confirmation.
3. Emails you (or whoever you set as admin) a notification with the details.

A Google Form link is kept as a manual backup ([src/config.js](src/config.js)
`GOOGLE_FORM_LINK`) — it's only shown to a visitor if the form's backend ever fails, so
there's no single point of failure.

## Pages

- **Home** — hero, online/home-visit paths, services overview, how-it-works, benefits,
  Chennai service-area map, testimonials, FAQ
- **About** — story, values
- **Services** — full breakdown of physiotherapy services offered
- **Blog** — SEO articles targeting real search terms ([src/data/blogPosts.js](src/data/blogPosts.js))
- **Contact** — contact details + the enquiry form
- **Privacy Policy** — required for Google/Meta ads and basic patient-data trust

## One-time setup: enquiry form backend

The form won't actually save/email anything until these environment variables are set in
**Vercel → your project → Settings → Environment Variables**. Add secrets there directly —
never commit them to the repo or paste them into chat.

| Variable | Where to get it |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | From the service account JSON key (see below) — the `client_email` field |
| `GOOGLE_PRIVATE_KEY` | From the same JSON key — the `private_key` field (paste it exactly as-is, including the `BEGIN/END PRIVATE KEY` lines) |
| `GOOGLE_SHEET_ID` | The long ID in your Sheet's URL: `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit` |
| `GMAIL_USER` | `Virtualphysiocare@gmail.com` |
| `GMAIL_APP_PASSWORD` | A 16-character App Password (see below) — **not** your normal Gmail password |
| `ADMIN_NOTIFY_EMAIL` | Optional — where enquiry notifications go. Defaults to `GMAIL_USER` if omitted |

### 1. Create the Google Sheet
Create a new blank Google Sheet (not linked to a Form). In row 1, add these column headers,
in this order: `Timestamp | Type | Name | Email | Phone | Location | Message | Preferred Date & Time`.
Copy its Sheet ID from the URL.

### 2. Create a Google Cloud service account (lets the site write to the Sheet)
1. Go to [console.cloud.google.com](https://console.cloud.google.com), create a project (or
   use an existing one).
2. **APIs & Services → Library** → search "Google Sheets API" → **Enable**.
3. **APIs & Services → Credentials → Create Credentials → Service Account** → give it any
   name (e.g. "sheets-writer") → Create.
4. Open the new service account → **Keys** tab → **Add Key → Create new key → JSON** →
   this downloads a `.json` file. Open it — you need the `client_email` and `private_key`
   fields from it.
5. Back in your Google Sheet, click **Share**, and share it with the `client_email` address
   (like sharing with a person), giving **Editor** access.

### 3. Create a Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com) while signed into
   `Virtualphysiocare@gmail.com`.
2. Turn on **2-Step Verification** under Security, if it isn't already on.
3. Under Security, find **App Passwords** → create one (name it "Website") → copy the
   16-character password shown.

### 4. Add everything to Vercel and redeploy
Add all six variables above in Vercel's Environment Variables settings, then trigger a new
deployment (push any commit, or use Vercel's "Redeploy" button) so the function picks them up.

### Testing the function locally without real credentials
```bash
npm run test:api
```
This runs [scripts/test-api.mjs](scripts/test-api.mjs), which calls the function directly with
mock requests to check validation, spam-honeypot handling, and error handling — without needing
real Google/Gmail credentials. It won't actually write to a Sheet or send email.

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173. Note: the `/api` serverless function only runs on Vercel (or via
`vercel dev` if you've linked the project locally) — plain `npm run dev` serves the frontend only.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. This project is deployed on Vercel, which auto-detects the Vite
frontend and the `/api` serverless functions together.

## Future enhancements (not implemented yet)

- Online payment (Razorpay for India, Stripe/PayPal for international clients)
- Google Analytics 4 / Meta Pixel / Google Ads conversion tracking
- Google Business Profile listing for Chennai local search
- Real therapist bios/photos and verified Google Reviews widget
- A simple admin view of enquiry status (New / Contacted / Booked) instead of a plain Sheet
