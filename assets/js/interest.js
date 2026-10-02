/*
 * "I'm interested" sign-ups for schools without a bike bus yet.
 *
 * 1. Counts: reads data/interest.json (totals only, refreshed by the
 *    update-interest workflow) and fills each card's status line (rules below).
 * 2. Form: moves #interest into a <dialog> opened from the cards' buttons,
 *    with that school pre-ticked, and submits it to the Google Apps Script
 *    without leaving the page. Without JS, the form sits at the bottom of the
 *    page and posts normally.
 */
(function () {
  "use strict";

  // ---- counts ----
  // Status line on each "not started" card:
  //   0       → "Not started"
  //   1-2     → "Not started · 2 families interested"
  //   3+      → "Not started · 3 families"
  //   goal    → "Forming · 4 families, 1 leader" (gold dot): GOAL_FAMILIES + a leader
  // Leaders are only shown from GOAL_FAMILIES up, where they can't identify someone.
  var GOAL_FAMILIES = 3;
  var statusEls = document.querySelectorAll(".card-soon-status[data-school]");
  if (statusEls.length && window.fetch) {
    fetch("data/interest.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        Array.prototype.forEach.call(statusEls, function (el) {
          var c = data[el.getAttribute("data-school")] || {};
          var n = Number(c.interested) || 0, leaders = Number(c.leaders) || 0;
          var count = el.querySelector(".interest-count");
          var families = n + (n === 1 ? " family" : " families");
          if (n === 0) return;
          if (n < GOAL_FAMILIES) {
            count.textContent = families + " interested";
          } else {
            count.textContent = families + (leaders > 0 ? ", " + leaders + (leaders === 1 ? " leader" : " leaders") : "");
            if (leaders > 0) {
              el.classList.add("is-forming");
              el.querySelector(".status-label").textContent = "Forming";
            }
          }
          count.hidden = false;
        });
      })
      .catch(function (err) { console.warn("[interest] counts not shown:", err); });
  }

  // ---- form in a dialog ----
  var section = document.getElementById("interest");
  var form = section && section.querySelector(".interest-form");
  if (!form || !window.fetch || typeof HTMLDialogElement !== "function") return;

  var endpoint = form.getAttribute("action");
  var article = section.querySelector("article");
  var dialog = document.createElement("dialog");
  dialog.className = "interest-dialog";
  dialog.setAttribute("aria-labelledby", "interest-title");
  dialog.appendChild(article);
  section.parentNode.replaceChild(dialog, section);

  var close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Close");
  close.setAttribute("rel", "prev");
  close.addEventListener("click", function () { dialog.close(); });
  article.querySelector("header").insertBefore(close, article.querySelector("header").firstChild);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  var status = form.querySelector(".form-status");
  var submit = form.querySelector('button[type="submit"]');

  function open(school) {
    form.hidden = false;
    form.reset();
    status.textContent = "";
    submit.disabled = false;
    Array.prototype.forEach.call(form.querySelectorAll('input[name="schools"]'), function (box) {
      box.checked = box.value === school;
    });
    dialog.showModal();
    form.querySelector('input[name="name"]').focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".interest-open"), function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      open(btn.getAttribute("data-school"));
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var schools = Array.prototype.filter.call(form.querySelectorAll('input[name="schools"]'), function (b) { return b.checked; })
      .map(function (b) { return b.value; });
    if (!schools.length) {
      status.textContent = "Please pick at least one school.";
      return;
    }
    var payload = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      schools: schools,
      lead: form.elements.lead.checked,
      website: form.elements.website.value
    };
    submit.disabled = true;
    status.textContent = "Sending…";

    // text/plain keeps this a "simple" request (no CORS preflight), which Apps Script needs.
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) {
          var err = new Error("rejected");
          err.friendly = res && res.message;   // the script's own wording, e.g. "Please add a valid email"
          throw err;
        }
        // Swap the whole panel for a simple thank-you (restored when the dialog closes).
        var header = article.querySelector("header");
        header.hidden = true;
        form.hidden = true;
        var thanks = document.createElement("div");
        thanks.className = "form-thanks";
        thanks.setAttribute("role", "status");
        thanks.innerHTML = '<h2>Thanks, you\'re on the list!</h2><p>We\'ll be in touch when a bike bus is forming at your school.</p>';
        var done = document.createElement("button");
        done.type = "button";
        done.textContent = "Close";
        done.addEventListener("click", function () { dialog.close(); });
        thanks.appendChild(done);
        article.appendChild(thanks);
        done.focus();
        dialog.addEventListener("close", function () { thanks.remove(); header.hidden = false; }, { once: true });
        if (window.goatcounter && window.goatcounter.count) {
          window.goatcounter.count({ path: "interest-submit", title: "Interest form submitted", event: true });
        }
      })
      .catch(function (err) {
        console.warn("[interest] submit failed:", err);
        submit.disabled = false;
        status.textContent = (err && err.friendly) ||
          "Sorry, that didn't go through. Please try again, or email hello@slvbikebus.org.";
      });
  });
})();
