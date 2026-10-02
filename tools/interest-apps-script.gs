/**
 * SLV Bike Bus: "I'm interested" receiver.
 *
 * Paste this into the Apps Script editor of a private Google Sheet
 * (Extensions → Apps Script), run setup() once, then deploy as a web app
 * (Execute as: Me, Who has access: Anyone). Full steps: INTEREST-HOWTO.md.
 *
 * Security notes:
 *  - @OnlyCurrentDoc limits this script to the one Sheet it's attached to.
 *  - doGet returns ONLY totals, never rows, names, or emails.
 *  - Every submission is appended; nothing is ever overwritten, and the reply is
 *    always the same, so the form can't be used to check whether an email exists.
 *  - Every value is written as plain text (a leading = + - @ can never become a
 *    formula), so a submission can't run anything when the Sheet is opened.
 *  - The GitHub token lives in Script Properties (GITHUB_TOKEN), not in this code.
 *
 * @OnlyCurrentDoc
 */

var SHEET_NAME = "Responses";
var HEADERS = ["Submitted", "Name", "Email", "Schools", "Willing to lead"];
var SCHOOLS = { slvms: "SLV Middle School", slvhs: "SLV High School" };
var GITHUB_REPO = "benruggeberg/SLV-Bike-Bus";
var COUNT_WORKFLOW = "update-interest.yml";
var MAX_PER_MINUTE = 20;   // simple flood guard across all visitors

/** Run once from the editor: creates the sheet, headers, and plain-text columns. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A:E").setNumberFormat("@");   // store everything as text
}

/** Form submissions: JSON (from the site's script) or a plain form post (no-JS fallback). */
function doPost(e) {
  var isJson = e && e.postData && /json|text\/plain/.test(e.postData.type || "");
  var data = {};
  try {
    data = isJson ? JSON.parse(e.postData.contents || "{}") : (e.parameter || {});
    if (!isJson && e.parameters && e.parameters.schools) data.schools = e.parameters.schools;  // several checkboxes
  } catch (err) {
    return reply_(isJson, false, "Sorry, that didn't come through. Please try again.");
  }

  // Honeypot: real people never see or fill this field. Pretend success.
  if (clean_(data.website)) return reply_(isJson, true);

  var name = clean_(data.name, 100);
  var email = clean_(data.email, 200).toLowerCase();
  var schools = [].concat(data.schools || data.school || [])
    .map(function (s) { return String(s).trim().toLowerCase(); })
    .filter(function (s, i, all) { return SCHOOLS.hasOwnProperty(s) && all.indexOf(s) === i; });
  var lead = data.lead === true || data.lead === "true" || data.lead === "yes" || data.lead === "on";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !schools.length) {
    return reply_(isJson, false, "Please add your name, a valid email, and at least one school.");
  }

  // Flood guard: cap total submissions per minute.
  var cache = CacheService.getScriptCache();
  var minuteKey = "n-" + Math.floor(Date.now() / 60000);
  var n = Number(cache.get(minuteKey) || 0);
  if (n >= MAX_PER_MINUTE) return reply_(isJson, false, "Lots of sign-ups right now. Please try again in a minute.");
  cache.put(minuteKey, String(n + 1), 120);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    var stamp = Utilities.formatDate(new Date(), "America/Los_Angeles", "yyyy-MM-dd HH:mm");
    var schoolNames = schools.map(function (k) { return SCHOOLS[k]; }).join(", ");
    sheet.appendRow([stamp, name, email, schoolNames, lead ? "yes" : "no"].map(asText_));
  } finally {
    lock.releaseLock();
  }

  requestCountUpdate_();
  return reply_(isJson, true);
}

/** Public totals for the site's cards. Numbers only. */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify(totals_()))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Unique emails per school (repeat sign-ups count once), and how many will lead. */
function totals_() {
  var out = {}, keyByName = {};
  Object.keys(SCHOOLS).forEach(function (k) { out[k] = { interested: {}, leaders: {} }; keyByName[SCHOOLS[k]] = k; });
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var rows = sheet ? sheet.getDataRange().getValues().slice(1) : [];
  rows.forEach(function (r) {
    var email = String(r[2] || "").replace(/^'/, "").trim().toLowerCase();
    if (!email) return;
    String(r[3] || "").split(",").forEach(function (name) {
      var s = keyByName[name.trim()];
      if (!s) return;
      out[s].interested[email] = true;
      if (String(r[4]).trim() === "yes") out[s].leaders[email] = true;
    });
  });
  var result = {};
  Object.keys(out).forEach(function (k) {
    result[k] = {
      interested: Object.keys(out[k].interested).length,
      leaders: Object.keys(out[k].leaders).length
    };
  });
  return result;
}

/** Nudge GitHub to refresh the public counts. Failures are ignored (a daily run catches up). */
function requestCountUpdate_() {
  var token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  if (!token) return;
  try {
    UrlFetchApp.fetch(
      "https://api.github.com/repos/" + GITHUB_REPO + "/actions/workflows/" + COUNT_WORKFLOW + "/dispatches",
      {
        method: "post",
        contentType: "application/json",
        headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
        payload: JSON.stringify({ ref: "main" }),
        muteHttpExceptions: true
      }
    );
  } catch (err) {
    console.warn("count update request failed: " + err);
  }
}

/** Trim, strip control characters, and cap length. */
function clean_(v, max) {
  var s = String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  return max ? s.slice(0, max) : s;
}

/** Force plain text in the Sheet: a leading = + - @ becomes literal text, never a formula. */
function asText_(v) {
  var s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** JSON for the site's script; a simple page for the no-JavaScript form post. */
function reply_(isJson, ok, message) {
  if (isJson) {
    return ContentService.createTextOutput(JSON.stringify({ ok: ok, message: message || "" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var text = ok ? "Thanks, you're on the list! We'll be in touch about a bike bus at your school."
                : (message || "Something went wrong.");
  return HtmlService.createHtmlOutput(
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<div style="font:18px/1.5 system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem">' +
    "<p>" + text.replace(/[<>&]/g, "") + "</p>" +
    '<p><a href="https://slvbikebus.org/">Back to SLV Bike Bus</a></p></div>'
  ).setTitle("SLV Bike Bus");
}
