# SLV Bike Bus website

Static site for the SLV Bike Bus, a morning group ride to San Lorenzo Valley Elementary.
Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages from `main` (repo root).

- **Posting a rain/cancel notice:** see [STATUS-HOWTO.md](STATUS-HOWTO.md).
- **Design proposal:** see [DESIGN-PLAN.md](DESIGN-PLAN.md) (awaiting review).

## Layout

```
/                          Landing page, list of routes
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
   `data-route-links="sle=sle/,ms=ms/"`) and route list.
4. With two or more routes, consider moving the shared header/footer into Jekyll includes.

## Open items: TODO(Ben)

Search the repo for `TODO(Ben)` to find each one in place.

- [ ] Text-update service and join code: `sle/index.html`, "text-signup block" in How to join
- [ ] Logo: hero placeholder in `sle/index.html`; also `og:image` on `/` and `/sle/`
- [ ] Contact email: `sle/index.html` #contact
- [ ] Disclaimer wording, reviewed (check school/district language): `sle/disclaimer/index.html`
- [ ] Rain policy: FAQ
- [ ] Confirm "running late" answer: FAQ
- [ ] What helping lead involves: FAQ
- [ ] Can non-e-bikes ride: "Who can ride"
- [ ] First-ride risk acknowledgment: commented-out slot in How to join
- [ ] Photo policy: footer
- [ ] Safety tips review: #safety
- [ ] Ride-leader safety handout link: #safety
- [ ] Partner "Thanks to" line (only with permission): commented out in #contact
- [ ] Bell time: season comment in `sle/index.html` (not displayed yet)
- [ ] Design token plan review: `DESIGN-PLAN.md`
- [ ] Custom domain: add `CNAME` containing `slvbikebus.org`, set DNS, enforce HTTPS

Done: route line traced from `SLV_Bike_Bus_Route.gpx` (about 1.04 miles).
