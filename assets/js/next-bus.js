/*
 * "Next bus" line: tells a parent when the next ride leaves, from
 * data/schedule-<route>.json (season dates + no-school days) and today's
 * status.json entry (a cancelled day doesn't count). Everything is in
 * America/Los_Angeles time. If anything fails, the line stays hidden and the
 * static facts on the page still say when the bus runs.
 *
 * Markup: <p class="next-bus" data-schedule="…/schedule-sle.json"
 *            data-status="…/status.json" data-route="sle" hidden></p>
 */
(function () {
  "use strict";

  var els = document.querySelectorAll(".next-bus");
  if (!els.length || !window.fetch || !window.Intl) return;

  var DAY_MS = 86400000;
  var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  // Current date and minutes-since-midnight in Los Angeles.
  function nowLA() {
    var parts = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles", hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    return {
      date: parts.year + "-" + parts.month + "-" + parts.day,
      minutes: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10)
    };
  }

  // Date strings are handled as UTC midnights so day arithmetic ignores DST.
  function toUTC(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function toStr(t) { return new Date(t).toISOString().slice(0, 10); }
  function toMinutes(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }
  function clock(hhmm) {
    var m = toMinutes(hhmm), h = Math.floor(m / 60), mm = m % 60;
    return ((h + 11) % 12 + 1) + ":" + (mm < 10 ? "0" : "") + mm + (h < 12 ? "am" : "pm");
  }

  function isRidingDay(dateStr, sched, cancelled) {
    var t = toUTC(dateStr), dow = new Date(t).getUTCDay();
    return t >= toUTC(sched.start) && t <= toUTC(sched.end) &&
      dow >= 1 && dow <= 5 &&
      sched.noSchool.indexOf(dateStr) === -1 &&
      dateStr !== cancelled;
  }

  function dayLabel(dateStr, today) {
    var diff = Math.round((toUTC(dateStr) - toUTC(today)) / DAY_MS);
    var d = new Date(toUTC(dateStr));
    if (diff === 1) return "tomorrow";
    if (diff < 7) return WEEKDAYS[d.getUTCDay()];
    return WEEKDAYS[d.getUTCDay()] + ", " + MONTHS[d.getUTCMonth()] + " " + d.getUTCDate();
  }

  // Returns { text, rolling }.
  function message(sched, cancelledDate) {
    var now = nowLA();
    var depart = toMinutes(sched.departTime), arrive = toMinutes(sched.arriveBy);
    var at = " at " + clock(sched.departTime);

    if (isRidingDay(now.date, sched, cancelledDate)) {
      var until = depart - now.minutes;
      if (until > 90) return { text: "Next bus: today" + at };
      if (until > 1) return { text: "Next bus leaves in " + until + " minutes" };
      if (until >= 0) return { text: "The bus is leaving now", rolling: true };
      if (now.minutes < arrive) return { text: "Rolling now. Arriving at school by " + clock(sched.arriveBy), rolling: true };
    }

    var prefix = (now.date === cancelledDate && now.minutes < arrive) ? "No bus today. " : "";
    var beforeSeason = toUTC(now.date) < toUTC(sched.start);
    for (var t = toUTC(now.date) + DAY_MS; t <= toUTC(sched.end); t += DAY_MS) {
      var d = toStr(t);
      if (isRidingDay(d, sched, cancelledDate)) {
        return { text: prefix + (beforeSeason ? "First bus: " : "Next bus: ") + dayLabel(d, now.date) + at };
      }
    }
    if (beforeSeason) return null;
    return { text: prefix + "That's a wrap for this season. Thanks for riding!" };
  }

  function getJSON(url) {
    return fetch(url + (url.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  Array.prototype.forEach.call(els, function (el) {
    var route = el.getAttribute("data-route");
    var statusReq = getJSON(el.getAttribute("data-status"))
      .then(function (s) {
        var e = s && s[route];
        return e && e.level === "cancelled" ? e.date : null;
      })
      .catch(function () { return null; });   // no status file is fine

    Promise.all([getJSON(el.getAttribute("data-schedule")), statusReq])
      .then(function (res) {
        var sched = res[0], cancelled = res[1];
        if (!sched.start || !sched.end || !sched.departTime || !sched.arriveBy || !Array.isArray(sched.noSchool)) {
          throw new Error("schedule is missing fields");
        }
        function update() {
          var m = message(sched, cancelled);
          if (!m) { el.hidden = true; return; }
          el.textContent = m.text;
          el.classList.toggle("is-rolling", !!m.rolling);
          el.hidden = false;
        }
        update();
        setInterval(update, 30000);
      })
      .catch(function (err) { console.warn("[next-bus] not shown:", err); });
  });
})();
