const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const quoteForm = document.querySelector("#quoteForm");
const whatsappNumber = "905454491860";

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
  document.body.classList.toggle("show-mobile-actions", window.scrollY > 260);
}

window.addEventListener("scroll", updateHeader);
updateHeader();

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll(".brand[href='#top']").forEach((brandLink) => {
  brandLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

document.querySelectorAll(".nav-call, .hero-actions a[href^='tel:']").forEach((callButton) => {
  callButton.addEventListener("click", (event) => {
    const isDesktop = window.matchMedia("(min-width: 821px)").matches;

    if (!isDesktop) {
      return;
    }

    event.preventDefault();
    const contactSection = document.querySelector("#iletisim");

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.href = "index.html#iletisim";
  });
});

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const message = [
      "Merhaba FEZA Kurtarma, hizmet talebi oluşturmak istiyorum.",
      `Ad Soyad: ${data.get("name")}`,
      `Telefon: ${data.get("phone")}`,
      `Hizmet: ${data.get("service")}`,
      `Not: ${data.get("message") || "-"}`,
    ].join("\n");

    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  });
}
