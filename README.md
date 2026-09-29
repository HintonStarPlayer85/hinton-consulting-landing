# Hinton Consulting Landing System

Production static landing-page system for Hinton Consulting.

## Deployment architecture

GitHub Pages → `consult.hintonconsultingllc.com`

Lead capture is handled separately through Google Apps Script and Google Sheets:

Landing page → Google Apps Script → Google Sheet → branded success page → Calendly

## Core files

- `index.html` — primary conversion landing page
- `styles.css` — Hinton Consulting visual system and responsive layout
- `script.js` — navigation, interaction, UTM capture, lead handoff, and conversion UX
- `success.html` — post-capture transition to Calendly
- `CNAME` — custom GitHub Pages domain
- `.nojekyll` — publish static files directly without Jekyll processing
- `robots.txt` and `sitemap.xml` — search-engine configuration
- `google-apps-script/Code.gs` — free lead-capture backend
- `google-apps-script/SETUP.md` — Google Apps Script deployment notes

## GitHub Pages configuration

Publishing source:

- Branch: `main`
- Folder: `/ (root)`
- Custom domain: `consult.hintonconsultingllc.com`

DNS at GoDaddy:

- Type: `CNAME`
- Name: `consult`
- Value: `HintonStarPlayer85.github.io`
- TTL: default

Do not include the repository name in the CNAME target.

## Form handling

The consultation form posts directly to the deployed Google Apps Script web app. Netlify Forms is not used.

Captured fields include:

- Name
- Work email
- Organization
- Phone
- Primary focus
- Challenge / objective
- UTM source
- UTM medium
- UTM campaign
- UTM content
- Landing path
- Referrer

The form explicitly instructs visitors not to submit patient/client PHI.

## Analytics hooks

The JavaScript emits conversion events including:

- `consultation_cta_click`
- `consultation_form_submit`
- `lead_capture_complete`
- `calendly_redirect`

## Deployment QA

After GitHub Pages is enabled:

1. Confirm the Pages build is published.
2. Confirm `consult.hintonconsultingllc.com` is configured under repository Settings → Pages.
3. Update the GoDaddy `consult` CNAME to `HintonStarPlayer85.github.io`.
4. Wait for DNS verification and HTTPS provisioning.
5. Enable **Enforce HTTPS** once available.
6. Test the full lead flow:
   form → Google Sheet → success page → Calendly.
