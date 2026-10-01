/*
 * Route map. Loads Leaflet only when the map is about to scroll into view.
 * Scroll-wheel zoom is off. On touch screens one-finger drags scroll the page
 * past the map; two fingers pinch to zoom and move it.
 * If anything fails, the fallback text stays and the numbered route list
 * below the map carries the information.
 */
(function () {
  "use strict";

  var box = document.getElementById("route-map");
  if (!box) return;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("failed to load " + src)); };
      document.head.appendChild(s);
    });
  }

  function loadCss(href) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  function build(geojson) {
    var L = window.L;
    var touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var routeColor = getComputedStyle(box).getPropertyValue("--school-red").trim() || "#C1121F";

    box.innerHTML = "";
    var map = L.map(box, {
      scrollWheelZoom: false,
      zoomSnap: 0.25,
      dragging: !touch,
      touchZoom: true,
      tap: false
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var layer = L.geoJSON(geojson, {
      style: function () {
        return { color: routeColor, weight: 6, opacity: 0.9 };
      },
      pointToLayer: function (feature, latlng) {
        var kind = feature.properties.kind;
        return L.circleMarker(latlng, {
          radius: 9, weight: 4, color: routeColor, fillOpacity: 1,
          fillColor: kind === "end" ? routeColor : "#ffffff"
        }).bindTooltip(feature.properties.label || feature.properties.name,
          // Start sits on the east side of the route, the school on the west:
          // point labels inward so they don't run off a narrow screen.
          { permanent: true, direction: kind === "start" ? "left" : "right", className: "route-tooltip" });
      }
    }).addTo(map);

    map.fitBounds(layer.getBounds(), { padding: [30, 30] });
  }

  function start() {
    var css = box.getAttribute("data-leaflet-css");
    var js = box.getAttribute("data-leaflet-js");
    var data = box.getAttribute("data-geojson");
    loadCss(css);
    Promise.all([
      loadScript(js),
      fetch(data).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status + " for " + data);
        return r.json();
      })
    ])
      .then(function (results) { build(results[1]); })
      .catch(function (err) { console.warn("[map] not shown:", err); });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        start();
      }
    }, { rootMargin: "300px" });
    io.observe(box);
  } else {
    start();
  }
})();
