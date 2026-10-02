# "I'm interested" sign-ups: setup and care

Parents at schools without a bike bus (SLV Middle, SLV High) tap **I'm interested**
on the home page, fill in a short form, and their answers land in a **private Google
Sheet** that only you can see. The cards show "N families interested · M ready to
lead" (from 3 families up; before that, "Be one of the first.").

How the pieces fit:

1. The form on slvbikebus.org sends answers to a small **Google Apps Script** attached
   to your Sheet (`tools/interest-apps-script.gs`). It adds one row per sign-up.
2. Right after saving, the script nudges GitHub to run **Update interest counts**.
3. That job asks the script for **totals only** (never names or emails) and saves them
   to `data/interest.json`. The site redeploys; the card updates in 1-2 minutes.
4. A daily run (about 7am) catches up if a nudge ever fails.

## One-time setup (about 10 minutes)

### 1. The Sheet and script

1. Create a new Google Sheet named **SLV Bike Bus interest**. Leave sharing off.
2. **Extensions → Apps Script.** Delete the sample code and paste in everything from
   [`tools/interest-apps-script.gs`](https://github.com/benruggeberg/SLV-Bike-Bus/blob/main/tools/interest-apps-script.gs)
   (use the copy button on that page). Click **Save**.
3. In the function dropdown at the top, pick **setup** and click **Run**. Google asks
   for permission: choose your account. Because this is your own unpublished script,
   Google shows "Google hasn't verified this app": click **Advanced → Go to … (unsafe)**,
   then **Allow**. The Sheet now has a **Responses** tab with headers.
4. **Deploy → New deployment.** Click the gear next to "Select type" → **Web app**.
   - Description: `SLV Bike Bus interest`
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

### 2. The GitHub token (lets the script nudge the counter)

1. Go to https://github.com/settings/personal-access-tokens/new (a *fine-grained* token).
2. Token name: `SLV interest counter`. Expiration: **1 year** (put a reminder in your
   calendar to renew it).
3. Repository access: **Only select repositories** → **SLV-Bike-Bus**.
4. Permissions → Repository permissions → **Actions: Read and write**. Nothing else.
5. **Generate token** and copy it.
6. Back in Apps Script: **Project Settings** (gear icon on the left) → **Script
   Properties** → **Add script property**: name `GITHUB_TOKEN`, value = the token.
   **Save.**

Don't paste the token anywhere else (not in chat, email, or the code).

### 3. Hand off

Send Claude (or whoever maintains the site) the **Web app URL**. It gets saved as the
repo variable `INTEREST_URL` and written into the form on the home page.

## Day to day

- **See sign-ups:** open the Sheet. Filter the Schools column, or "Willing to lead" = yes.
- **Someone asks to be removed:** delete their row(s). To refresh the public count right
  away, open the repo's **Actions → Update interest counts → Run workflow**; otherwise
  it updates on the next sign-up or the daily run.
- **A school launches:** email that school's list, then delete those rows.
- **Spam rows:** delete them the same way. The form ignores obvious bots and caps
  sign-ups at 20 a minute.

## If you change the script later

**Deploy → Manage deployments →** pencil icon **→ Version: New version → Deploy.**
Editing the existing deployment keeps the same URL, so nothing on the site changes.

## Safety notes

- Turn on **2-step verification** for the Google account that owns the Sheet.
- Share the Sheet only with specific people (never "anyone with the link").
- The script can only touch this one Sheet, never stores anything as a formula, never
  overwrites rows, and its public address returns totals only.
- The GitHub token can only start workflows in this repo. If it ever leaks, delete it at
  https://github.com/settings/personal-access-tokens and make a new one.
