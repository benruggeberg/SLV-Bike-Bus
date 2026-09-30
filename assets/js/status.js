/*
 * Day-of status banner.
 * Reads status.json and shows a banner only when a route's entry is dated
 * today in America/Los_Angeles. Anything wrong (network, bad JSON, missing
 * route, stale date) means no banner, a console message, and nothing broken.
 *
 * Markup: <div id="status-banner" data-status-url="…/status.json"
 *               data-routes="sle" [data-route-links="sle=sle/"] hidden></div>
 * data-routes: comma-separated route keys to check.
 * data-route-links (landing page only): key=href pairs. When present, each
 * message is prefixed with the route name and linked to its page.
 */
(function () {
  "use strict";

  var LEVELS = { cancelled: "Cancelled", changed: "Change today", info: "Today" };
  var ROUTE_NAMES = { sle: "SLE Bike Bus" };

  var el = document.getElementById("status-banner");
  if (!el || !window.fetch) return;

  function todayInLA() {
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date());
  }

  function parseLinks(attr) {
    var links = {};
    (attr || "").split(",").forEach(function (pair) {
      var kv = pair.split("=");
      if (kv.length === 2) links[kv[0].trim()] = kv[1].trim();
    });
    return links;
  }

  function render(items, links) {
    items.forEach(function (item) {
      var box = document.createElement("div");
      box.className = "status-item status-" + item.level;

      if (item.level === "cancelled") {
        // Bold "no" sign so a cancellation reads at a glance
        var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");
        icon.setAttribute("class", "status-icon");
        icon.innerHTML = '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/>' +
          '<path d="M5 19 19 5" stroke="currentColor" stroke-width="2.5"/>';
        box.appendChild(icon);
      }

      var label = document.createElement("strong");
      label.className = "status-label";
      label.textContent = LEVELS[item.level] + ":";
      box.appendChild(label);
      box.appendChild(document.createTextNode(" "));

      if (links[item.route]) {
        var a = document.createElement("a");
        a.href = links[item.route];
        a.textContent = (ROUTE_NAMES[item.route] || item.route) + ".";
        box.appendChild(a);
        box.appendChild(document.createTextNode(" "));
      }

      box.appendChild(document.createTextNode(item.message));
      el.appendChild(box);
    });
    el.hidden = false;
  }

  var url = el.getAttribute("data-status-url") || "status.json";
  var routes = (el.getAttribute("data-routes") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  var links = parseLinks(el.getAttribute("data-route-links"));

  fetch(url + "?t=" + Date.now(), { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      var today = todayInLA();
      var items = [];
      routes.forEach(function (route) {
        var entry = data && data[route];
        if (!entry) { console.info("[status] no entry for route:", route); return; }
        if (!LEVELS.hasOwnProperty(entry.level)) { console.warn("[status] unknown level for", route, entry.level); return; }
        if (typeof entry.message !== "string" || !entry.message.trim()) { console.warn("[status] empty message for", route); return; }
        if (entry.date !== today) { console.info("[status] entry for", route, "is dated", entry.date, "not today (" + today + ")"); return; }
        items.push({ route: route, level: entry.level, message: entry.message.trim() });
      });
      if (items.length) render(items, links);
    })
    .catch(function (err) {
      console.warn("[status] could not load status.json:", err);
    });
})();
