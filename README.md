# Virtual Physio Care

Marketing + enquiry website for an online physiotherapy service serving patients in India
and abroad. Built with React + Vite. There is no custom backend — patient enquiries are
collected through an embedded **Google Form**, with responses landing in a linked
**Google Sheet** that you can view/export/share.

## Pages

- **Home** — hero, online/home-visit paths, services overview, how-it-works, benefits,
  Chennai service-area map, testimonials, FAQ
- **About** — story, values
- **Services** — full breakdown of physiotherapy services offered
- **Blog** — SEO articles targeting real search terms ([src/data/blogPosts.js](src/data/blogPosts.js))
- **Contact** — contact details + embedded booking/enquiry form
- **Privacy Policy** — required for Google/Meta ads and basic patient-data trust

## One-time setup: connect the Google Form

1. Go to [forms.google.com](https://forms.google.com) and create a new form with fields such
   as: Name, Email, Phone/WhatsApp, Country, Concern/Injury, Preferred Date & Time, Message.
2. Click **Responses** tab → click the green Sheets icon to create a linked Google Sheet.
   All submissions will appear there in real time.
3. Click **Send** → the `<>` embed icon → copy the `src` URL from the generated `<iframe>`
   (looks like `https://docs.google.com/forms/d/e/XXXXXXXX/viewform?embedded=true`).
4. Open [src/config.js](src/config.js) and paste that URL into `GOOGLE_FORM_EMBED_URL`
   (and the same link without `?embedded=true` into `GOOGLE_FORM_LINK`).
5. Update `CONTACT` in the same file with your real phone/WhatsApp number and email.
6. Optional — to have the "Book an Online Session" vs. "Book a Home Visit" buttons pre-select
   the right option in your form, follow the steps above `GOOGLE_FORM_SERVICE_TYPE_ENTRY_ID`
   in [src/config.js](src/config.js).

No other code changes are needed — the Contact page automatically embeds whatever form URL
you configure.

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
