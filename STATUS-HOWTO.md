# Posting a day-of notice

The banner at the top of the SLE page (and the home page) comes from `status.json`.
It only shows on the date in the file, in California time. The next day it disappears on its own, so you never have to clear it.

The site promises "no notice means we're riding," so post cancellations by 7:30am.
If you have a group chat with the riding families, post there too.

## Fastest: the "Post bike bus notice" form (any phone)

A GitHub Actions workflow writes `status.json` for you, fills in the date, and
redeploys the site. No typing JSON, so a typo can't break the banner.

**One-time setup (Android, Chrome):**
1. In Chrome, sign in to github.com and open
   https://github.com/benruggeberg/SLV-Bike-Bus/actions/workflows/post-status.yml
2. Tap the **⋮** menu, then **Add to Home screen**. Name it "Bike bus notice".

**Each time:**
1. Tap the **Bike bus notice** icon.
2. Tap **Run workflow**. A small form opens.
3. Pick the **Type of notice**: `cancelled` (red), `changed` (yellow with hazard
   stripes), `info` (yellow), or `clear` (takes today's notice down).
4. Type the **message**, e.g. "No bike bus today because of rain. See you tomorrow."
5. Pick **today**, or **tomorrow** if you're posting the night before.
6. Tap the green **Run workflow** button.
7. After about 1–2 minutes, open the site and refresh to check.

If the run fails (red ✗ in the list), GitHub emails you. The usual cause is an empty
message; run it again with one. The GitHub app may also offer "Run workflow"; if it
doesn't, use the Chrome shortcut.

## By hand (GitHub mobile app)

Use this as a backup, or to edit the wording of a notice that's already posted.

1. Open the **GitHub** app and go to the **SLV-Bike-Bus** repository.
2. Tap **Code** (or **Browse code**), then tap **status.json**.
3. Tap the **pencil** (Edit) icon. If you don't see it, tap the **•••** menu and choose **Edit file**.
4. Select all the text and replace it with one of the examples below.
5. Change the **date** to today (`YYYY-MM-DD`, for example `2026-10-07`) and edit the **message**.
6. Tap **Commit changes** (or **Save**), then **Commit** directly to `main`.
7. Wait 1–3 minutes, then open the site and pull to refresh. GitHub Pages takes a moment to update.

## Copy-paste examples

Keep the quotes and commas exactly as shown. Only change the text inside the quotes.

### Cancelled (big red banner)

```json
{
  "sle": {
    "date": "2026-10-07",
    "level": "cancelled",
    "message": "No bike bus today because of rain. See you tomorrow."
  }
}
```

### Changed (yellow banner with hazard stripes)

```json
{
  "sle": {
    "date": "2026-10-07",
    "level": "changed",
    "message": "Hwy 9 shoulder is closed for construction. Today we'll ride through the high school lot from Fall Creek Dr. Same start time."
  }
}
```

### Info (yellow banner)

```json
{
  "sle": {
    "date": "2026-10-07",
    "level": "info",
    "message": "Bike bus is on! Dress warm, it's chilly this morning."
  }
}
```

## If something goes wrong

- **Banner doesn't show:** check the date is today and written `YYYY-MM-DD`. Check the level is exactly `cancelled`, `changed`, or `info` (lowercase). Wait a couple more minutes and refresh.
- **Broke the file** (a missing quote or comma): the site keeps working, it just won't show a banner. Paste one of the examples above again.
- **Need to take a banner down early:** change the date to any past date, like `2000-01-01`.
