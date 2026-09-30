# SLV Bike Bus website

Static site for the SLV Bike Bus, a morning group ride to San Lorenzo Valley Elementary.
Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages from `main` (repo root).

- **Posting a rain/cancel notice:** see [STATUS-HOWTO.md](STATUS-HOWTO.md).
- **Design tokens:** see [DESIGN-PLAN.md](DESIGN-PLAN.md).

## Layout

```
/                          Landing page, one card per school (only SLE is live)
/sle/                      SLE Bike Bus page (flyer QR codes point here; never change this URL)
/sle/disclaimer/           Full disclaimer
/status.json               Day-of banner data
/data/route-sle.geojson    Route line + start/end points (from Ben's GPX trace)
/assets/css/site.css       Site styles (on top of Pico)
/assets/js/status.js       Day-of banner
/assets/js/map.js          Lazy-loaded Leaflet route map
/assets/fonts/             Self-hosted Overpass + Atkinson Hyperlegible (SIL OFL)
/assets/vendor/            Pico CSS 2.1.1, Leaflet 1.9.4 (vendored, don't edit)
/404.html
```

Page links use relative paths, so the site works both on the `github.io` project URL
and on the custom domain. The exception is `404.html`, which uses root paths and only
works fully on the custom domain.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000/sle/
```

`status.json` and the map need a web server; opening the file directly won't load them.

## New season

Edit the values listed in the comment at the top of `sle/index.html`. Each place they
appear is tagged `data-season="…"`. Also check the landing page's route summary in
`index.html` and the meta/Open Graph descriptions.

## Adding a route (e.g. /ms/)

1. Copy `sle/` to `ms/` and edit the content.
2. Add `data/route-ms.geojson` and point the map's `data-geojson` at it.
3. Add a `"ms"` key to `status.json`, add `ms` to `ROUTE_NAMES` in `assets/js/status.js`,
   and add it to the landing page's banner (`data-routes="sle,ms"`,
   `data-route-links="sle=sle/,ms=ms/"`). Turn that school's card into a live link.
4. With two or more routes, consider moving the shared header/footer into Jekyll includes.

## Open items: TODO(Ben)

Search the repo for `TODO(Ben)` to find each one in place.

- [ ] Final logo: replace `assets/img/logo-wip.webp`, `favicon-48.png`, `apple-touch-icon.png`, `og-image.jpg` (currently cut from the WIP circle)
- [ ] Disclaimer wording, reviewed (check school/district language): `sle/disclaimer/index.html`
- [ ] Confirm "running late" answer: FAQ
- [ ] Safety tips review: #ready, "On the ride"
- [ ] Partner "Thanks to" line (only with permission): commented out in #contact
- [ ] Bell time: season comment in `sle/index.html` (not displayed yet)

Decided / done:
- Route line traced from `SLV_Bike_Bus_Route.gpx` (about 1.04 miles); good enough for now.
- No text-update service for now (small group). Template left in a comment in How to join.
- No first-ride sign-in.
- Rain policy: rain or shine, cancel only when unsafe, "no notice means we're riding."
- Contact: hello@slvbikebus.org (Porkbun email forwarding).
- Any bike can ride; no need to say so. No handouts or photo policy for now.
- Custom domain live with HTTPS enforced (Porkbun DNS: 4 GitHub A records + www CNAME; domain verified).
