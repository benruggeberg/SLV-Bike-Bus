# Posting a day-of notice

The banner at the top of the SLE page (and the home page) comes from `status.json`.
It only shows on the date you put in the file, in California time. Tomorrow it disappears on its own, so you never have to clear it.

## From your phone (GitHub mobile app)

1. Open the **GitHub** app and go to the **SLV-Bike-Bus** repository.
2. Tap **Code** (or **Browse code**), then tap **status.json**.
3. Tap the **pencil** (Edit) icon. If you don't see it, tap the **•••** menu and choose **Edit file**.
4. Select all the text and replace it with one of the examples below.
5. Change the **date** to today (`YYYY-MM-DD`, for example `2026-10-07`) and edit the **message**.
6. Tap **Commit changes** (or **Save**), then **Commit** directly to `main`.
7. Wait 1–3 minutes, then open the site and pull to refresh. GitHub Pages takes a moment to update.

The site promises "no notice means we're riding," so post cancellations by 7:30am.
If you have a group chat with the riding families, post there too.

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

### Changed (yellow banner)

```json
{
  "sle": {
    "date": "2026-10-07",
    "level": "changed",
    "message": "Hwy 9 shoulder is closed for construction. Today we'll ride through the high school lot from Fall Creek Dr. Same start time."
  }
}
```

### Info (blue banner)

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
