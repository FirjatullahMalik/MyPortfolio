/* =====================================================================
   Portfolio interactions — Vanilla JS (no frameworks)
   Sections:
     1. Footer year
     2. Navbar (scroll state + mobile menu)
     3. Reveal on scroll (IntersectionObserver)
     4. Animated stat counters
     5. Contact form validation
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- 1. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Navbar ---------- */
  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var skillCards = document.querySelectorAll(".skill-card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
    skillCards.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
    skillCards.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- 4. Animated stat counters ---------- */
  var counters = document.querySelectorAll(".stat-num");
  var countersDone = false;
  function runCounters() {
    if (countersDone) return;
    countersDone = true;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var start = 0;
      var dur = 1400;
      var t0 = performance.now();
      function step(now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(start + (target - start) * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var heroStats = document.querySelector(".hero-stats");
  if (heroStats && "IntersectionObserver" in window) {
    var statsIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); statsIo.disconnect(); } });
    }, { threshold: 0.4 });
    statsIo.observe(heroStats);
  } else {
    runCounters();
  }

  /* ---------- 5. Contact form validation ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var successEl = document.getElementById("formSuccess");
    function setError(name, msg) {
      var field = form.querySelector('[name="' + name + '"]').closest(".field");
      var err = form.querySelector('.err[data-for="' + name + '"]');
      if (msg) { field.classList.add("invalid"); err.textContent = msg; }
      else { field.classList.remove("invalid"); err.textContent = ""; }
    }
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var ok = true;

      if (name.length < 2) { setError("name", "Nama minimal 2 karakter."); ok = false; } else setError("name", "");
      if (!validEmail(email)) { setError("email", "Masukkan email yang valid."); ok = false; } else setError("email", "");
      if (message.length < 10) { setError("message", "Pesan minimal 10 karakter."); ok = false; } else setError("message", "");

      if (ok) {
        successEl.classList.add("show");
        form.reset();
        setTimeout(function () { successEl.classList.remove("show"); }, 4000);
      }
    });
    // Clear error as the user types
    ["name", "email", "message"].forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (el) el.addEventListener("input", function () { setError(n, ""); });
    });
  }
})();
