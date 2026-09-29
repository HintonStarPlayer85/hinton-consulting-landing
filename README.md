# Hinton Consulting Landing System

Production static landing-page system for Hinton Consulting, designed for GitHub source control and Netlify deployment.

## Deployment architecture

GitHub -> Netlify -> `consult.hintonconsultingllc.com`

## Core files

- `index.html` — primary conversion landing page
- `styles.css` — shared design system and responsive layout
- `script.js` — navigation, motion, UTM capture, campaign analytics hooks, sticky consultation prompt
- `success.html` — consultation form success page
- `netlify.toml` — deployment, redirects, and security headers
- `robots.txt` and `sitemap.xml` — search-engine configuration

## Netlify deployment

1. In Netlify choose **Add new site -> Import an existing project -> GitHub**.
2. Select `HintonStarPlayer85/hinton-consulting-landing`.
3. No build command is required.
4. Publish directory: `.`
5. Deploy the site.
6. Under **Domain management**, add `consult.hintonconsultingllc.com`.
7. Create the CNAME record Netlify provides at the DNS provider for `hintonconsultingllc.com`.
8. Verify HTTPS/TLS provisioning.

## Form handling

The consultation form uses Netlify Forms and captures:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `landing_path`

The form explicitly instructs visitors not to submit patient/client PHI.

## Analytics hooks

The JavaScript emits:

- `consultation_cta_click`
- `consultation_form_submit`

These hooks can be consumed later by Google Tag Manager / GA4 or another analytics layer.

## Launch QA

Before public launch:

- Confirm final custom subdomain.
- Replace the typographic wordmark with the official logo asset if desired.
- Test Netlify Forms end-to-end.
- Add analytics/tag-manager IDs if campaign attribution will be measured.
- Confirm privacy/legal wording.
- Test desktop, tablet, and mobile layouts.
