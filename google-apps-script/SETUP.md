# Google Apps Script Lead Capture Setup

The landing-page lead database is:

**Google Sheet:** Hinton Consulting - Landing Page Leads  
**Spreadsheet ID:** `1p7YSKuOKIIndSuwR1tTq91Lv86EAEbppsG9shGYg0GY`  
**Sheet tab:** `Leads`

## One-time deployment

1. Open the Google Sheet.
2. Choose **Extensions → Apps Script**.
3. Delete the starter code from `Code.gs`.
4. Paste the contents of this repository's `google-apps-script/Code.gs`.
5. Click **Save**.
6. In Apps Script, open **Project Settings** and set the time zone to **America/New_York**.
7. Click **Deploy → New deployment**.
8. Select **Web app**.
9. Set **Execute as:** Me.
10. Set **Who has access:** Anyone.
11. Click **Deploy**.
12. Authorize the script when Google asks.
13. Copy the deployed Web App URL ending in `/exec`.

Send the `/exec` URL back to ChatGPT. The landing-page form can then be wired to the Apps Script endpoint and Netlify Forms can be removed completely.

## Lead flow

Landing page → Apps Script → Google Sheet → Hinton success page → Calendly

The Apps Script writes the lead before it returns the visitor to the branded transition page.

## Stored fields

- Timestamp
- Lead ID
- Name
- Work Email
- Organization
- Phone
- Primary Focus
- Challenge / Objective
- UTM Source
- UTM Medium
- UTM Campaign
- UTM Content
- Landing Path
- Referrer
- Lead Status
- Scheduling Status
- Notes

## Data protections included

- Honeypot bot field
- Required-field validation
- Field-length limits
- Spreadsheet formula-injection protection
- Script locking for simultaneous submissions
- No patient/client PHI should be entered through the marketing form
