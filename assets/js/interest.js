/*
 * "I'm interested" sign-ups for schools without a bike bus yet.
 *
 * 1. Counts: reads data/interest.json (totals only, refreshed by the
 *    update-interest workflow) and fills each card's .interest-count:
 *    0 → "Be one of the first."
 *    1-2 → "1 family interested so far. Be next!" (leaders left out at small
 *          numbers, where they could identify someone)
 *    FULL_AT+ → "12 families interested · 2 ready to lead"
 * 2. Form: moves #interest into a <dialog> opened from the cards' buttons,
 *    with that school pre-ticked, and submits it to the Google Apps Script
 *    without leaving the page. Without JS, the form sits at the bottom of the
 *    page and posts normally.
 */
(function () {
  "use strict";

  var FULL_AT = 3;

  // ---- counts ----
  var countEls = document.querySelectorAll(".interest-count[data-school]");
  if (countEls.length && window.fetch) {
    fetch("data/interest.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        Array.prototype.forEach.call(countEls, function (el) {
          var c = data[el.getAttribute("data-school")] || {};
          var n = Number(c.interested) || 0, leaders = Number(c.leaders) || 0;
          if (n >= FULL_AT) {
            el.textContent = n + " families interested" + (leaders > 0 ? " · " + leaders + " ready to lead" : "");
          } else if (n > 0) {
            el.textContent = n + (n === 1 ? " family" : " families") + " interested so far. Be next!";
          } else {
            el.textContent = "Be one of the first.";
          }
          el.hidden = false;
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
