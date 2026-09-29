/**
 * Hinton Consulting Landing Page Lead Capture
 * Google Apps Script Web App
 *
 * Storage:
 * Hinton Consulting - Landing Page Leads
 * Spreadsheet ID: 1p7YSKuOKIIndSuwR1tTq91Lv86EAEbppsG9shGYg0GY
 */

const CONFIG = Object.freeze({
  SPREADSHEET_ID: '1p7YSKuOKIIndSuwR1tTq91Lv86EAEbppsG9shGYg0GY',
  SHEET_NAME: 'Leads',
  SUCCESS_URL: 'https://consult.hintonconsultingllc.com/success.html',
  TIME_ZONE: 'America/New_York',
  MAX_STANDARD_FIELD: 500,
  MAX_CHALLENGE_FIELD: 5000
});

function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><body style="font-family:Arial,sans-serif;padding:32px">' +
    '<h2>Hinton Consulting Lead Capture</h2>' +
    '<p>This endpoint accepts consultation form submissions.</p>' +
    '</body></html>'
  );
}

function doPost(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};

    // Honeypot: silently discard bot submissions.
    if (String(params['bot-field'] || '').trim()) {
      return redirectOutput_(CONFIG.SUCCESS_URL);
    }

    const name = clean_(params.name, CONFIG.MAX_STANDARD_FIELD);
    const email = clean_(params.email, CONFIG.MAX_STANDARD_FIELD);
    const organization = clean_(params.organization, CONFIG.MAX_STANDARD_FIELD);
    const phone = clean_(params.phone, CONFIG.MAX_STANDARD_FIELD);
    const focus = clean_(params.focus, CONFIG.MAX_STANDARD_FIELD);
    const challenge = clean_(params.challenge, CONFIG.MAX_CHALLENGE_FIELD);

    if (!name || !email || !organization || !focus || !challenge) {
      return errorOutput_('Required consultation information is missing.');
    }

    const now = new Date();
    const timestamp = Utilities.formatDate(
      now,
      CONFIG.TIME_ZONE,
      'yyyy-MM-dd HH:mm:ss'
    );

    const leadId = buildLeadId_(now);

    const row = [
      timestamp,
      leadId,
      safeCell_(name),
      safeCell_(email),
      safeCell_(organization),
      safeCell_(phone),
      safeCell_(focus),
      safeCell_(challenge),
      safeCell_(clean_(params.utm_source, CONFIG.MAX_STANDARD_FIELD)),
      safeCell_(clean_(params.utm_medium, CONFIG.MAX_STANDARD_FIELD)),
      safeCell_(clean_(params.utm_campaign, CONFIG.MAX_STANDARD_FIELD)),
      safeCell_(clean_(params.utm_content, CONFIG.MAX_STANDARD_FIELD)),
      safeCell_(clean_(params.landing_path, CONFIG.MAX_STANDARD_FIELD)),
      safeCell_(clean_(params.referrer, CONFIG.MAX_STANDARD_FIELD)),
      'New',
      'Pending Scheduling',
      ''
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

      if (!sheet) {
        throw new Error('Lead destination sheet was not found.');
      }

      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return redirectOutput_(CONFIG.SUCCESS_URL);

  } catch (error) {
    console.error(error);
    return errorOutput_(
      'We could not save your consultation request. Please return to the Hinton Consulting page and try again.'
    );
  }
}

function clean_(value, maxLength) {
  return String(value || '')
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Prevent spreadsheet-formula injection from user-controlled cells.
 * Values beginning with =, +, -, or @ are forced to plain text.
 */
function safeCell_(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function buildLeadId_(date) {
  const datePart = Utilities.formatDate(date, CONFIG.TIME_ZONE, 'yyyyMMdd-HHmmss');
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return 'HC-' + datePart + '-' + randomPart;
}

function redirectOutput_(url) {
  const safeUrl = JSON.stringify(String(url));
  return HtmlService.createHtmlOutput(
    '<!doctype html>' +
    '<html><head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Hinton Consulting</title>' +
    '</head>' +
    '<body style="margin:0;background:#111235;color:#fff;font-family:Arial,sans-serif;' +
      'min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px">' +
    '<div><p style="color:#d33ce6;font-weight:700;letter-spacing:.12em">REQUEST SAVED</p>' +
    '<h1 style="margin:0 0 12px">Continuing to scheduling…</h1>' +
    '<p style="color:rgba(255,255,255,.72)">Your consultation request has been captured.</p></div>' +
    '<script>window.location.replace(' + safeUrl + ');<\/script>' +
    '</body></html>'
  );
}

function errorOutput_(message) {
  const escaped = String(message)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return HtmlService.createHtmlOutput(
    '<!doctype html>' +
    '<html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Submission Error | Hinton Consulting</title></head>' +
    '<body style="margin:0;background:#111235;color:#fff;font-family:Arial,sans-serif;' +
      'min-height:100vh;display:grid;place-items:center;padding:24px">' +
    '<div style="max-width:620px">' +
    '<p style="color:#f22a9e;font-weight:700;letter-spacing:.1em">SUBMISSION ERROR</p>' +
    '<h1>We could not save your request.</h1>' +
    '<p style="color:rgba(255,255,255,.72)">' + escaped + '</p>' +
    '<p><a href="https://consult.hintonconsultingllc.com/#consultation" ' +
      'style="color:#fff;background:#d33ce6;padding:12px 18px;text-decoration:none;display:inline-block">' +
      'Return to Consultation Form</a></p>' +
    '</div></body></html>'
  );
}
