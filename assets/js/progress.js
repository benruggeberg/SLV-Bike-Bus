/*
 * Page-as-a-route progress (wide screens only; the line is hidden elsewhere).
 * As the reader scrolls, the green line down the margin fills in and each
 * section's stop marker fills when reached; the current stop is drawn larger.
 * Sets on each .stop: class "reached"/"current" and --fill (0–1, how much of
 * the segment below it has been ridden). Without JS the line shows as a plain
 * solid route.
 */
(function () {
  "use strict";

  var main = document.querySelector("main");
  var stops = Array.prototype.slice.call(document.querySelectorAll(".stop"));
  if (!main || !stops.length || !window.matchMedia) return;

  var wide = window.matchMedia("(min-width: 1024px)");
  var pending = false;

  function update() {
    pending = false;
    var ref = window.innerHeight * 0.4;          // the "rider" sits 40% down the screen
    // At the very bottom the last stops may never reach the 40% mark; count them as reached.
    var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    var current = -1;

    stops.forEach(function (el, i) {
      var top = el.getBoundingClientRect().top;
      var next = stops[i + 1];
      var end = next ? next.getBoundingClientRect().top : top;
      var fill = next ? (ref - top) / Math.max(end - top, 1) : 0;
      fill = Math.min(Math.max(fill, 0), 1);
      if (atBottom) fill = next ? 1 : 0;
      el.style.setProperty("--fill", fill.toFixed(3));
      if (top <= ref || atBottom) current = i;
    });

    stops.forEach(function (el, i) {
      el.classList.toggle("reached", i <= current);
      el.classList.toggle("current", i === current);
    });
  }

  function schedule() {
    if (!pending) { pending = true; window.requestAnimationFrame(update); }
  }

  function setMode() {
    if (wide.matches) {
      main.classList.add("has-progress");
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      update();
    } else {
      main.classList.remove("has-progress");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  }

  if (wide.addEventListener) wide.addEventListener("change", setMode);
  setMode();
})();
