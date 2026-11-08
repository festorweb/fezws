const header = document.querySelector(".site-header, .ref-header");
const navToggle = document.querySelector(".nav-toggle, .ref-nav-toggle");
const nav = document.querySelector(".site-nav, .ref-nav");
const quoteForm = document.querySelector("#quoteForm");
const whatsappNumber = "905454491860";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileNav = window.matchMedia("(max-width: 900px)");

function updateNavInteractivity() {
  if (nav?.classList.contains("ref-nav")) {
    nav.inert = mobileNav.matches && !nav.classList.contains("open");
  }
}

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
  document.body.classList.toggle("show-mobile-actions", window.scrollY > 260);
}

function closeNav() {
  if (nav?.contains(document.activeElement)) navToggle?.focus({ preventScroll: true });
  nav?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Menüyü aç");
  updateNavInteractivity();
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
updateNavInteractivity();
mobileNav.addEventListener("change", closeNav);

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
    updateNavInteractivity();
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNav();
});

document.querySelectorAll(".brand[href='#top'], .brand[href='#anasayfa'], .ref-brand[href='#anasayfa']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeNav();
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const message = [
      "Merhaba FEZA Kurtarma, hizmet talebi oluşturmak istiyorum.",
      "Ad Soyad: " + data.get("name"),
      "Telefon: " + data.get("phone"),
      "Hizmet: " + data.get("service"),
      "Not: " + (data.get("message") || "-"),
    ].join("\n");

    window.location.href = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
  });
}
