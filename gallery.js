(() => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const section = gallery.closest("section");
  const track = gallery.querySelector("[data-gallery-track]");
  const slides = [...gallery.querySelectorAll("[data-gallery-slide]")];
  if (!slides.length) return;

  const autoplay = section.querySelector("[data-gallery-autoplay]");
  const thumbnails = gallery.querySelector("[data-gallery-thumbnails]");
  const announcement = gallery.querySelector("[data-gallery-announcement]");
  const dialog = section.querySelector("[data-gallery-lightbox]");
  const fullImage = dialog.querySelector("[data-gallery-full-image]");
  const fullCaption = dialog.querySelector("[data-gallery-full-caption]");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 700px)");
  const photos = slides.map((slide) => ({
    image: slide.querySelector("img"),
    link: slide.querySelector("[data-gallery-open]"),
    title: slide.querySelector("h3").textContent,
    category: slide.querySelector("figcaption p").textContent,
  }));

  let current = 0;
  let wantsAutoplay = !motion.matches;
  let visible = false;
  let hovered = false;
  let focused = false;
  let dragging = false;
  let gestureStart;
  let suppressClickUntil = 0;
  let autoplayTimer;

  // Only run the timer while the gallery is being viewed and isn't in use.
  function schedule() {
    clearTimeout(autoplayTimer);
    autoplay.setAttribute("aria-pressed", String(wantsAutoplay));
    autoplay.setAttribute("aria-label", wantsAutoplay ? "Otomatik geçişleri duraklat" : "Otomatik geçişleri başlat");
    if (slides.length > 1 && wantsAutoplay && visible && !document.hidden && !hovered && !focused && !dragging && !dialog.open) {
      autoplayTimer = setTimeout(() => goTo(current + 1), 5000);
    }
  }

  function sync(manual = false) {
    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== current));
      photos[index].link.tabIndex = index === current ? 0 : -1;
      thumbnails.children[index].setAttribute("aria-pressed", String(index === current));
    });
    const activeThumb = thumbnails.children[current];
    const vertical = !mobileLayout.matches;
    const thumbRect = activeThumb.getBoundingClientRect();
    const railRect = thumbnails.getBoundingClientRect();
    const scroll = vertical ? thumbnails.scrollTop : thumbnails.scrollLeft;
    const viewportSize = vertical ? thumbnails.clientHeight : thumbnails.clientWidth;
    const thumbSize = vertical ? activeThumb.offsetHeight : activeThumb.offsetWidth;
    const thumbStart = (vertical ? thumbRect.top - railRect.top : thumbRect.left - railRect.left) + scroll;
    if (thumbStart < scroll || thumbStart + thumbSize > scroll + viewportSize) {
      const target = thumbStart - (viewportSize - thumbSize) / 2;
      thumbnails.scrollTo({ top: vertical ? target : 0, left: vertical ? 0 : target, behavior: motion.matches ? "auto" : "smooth" });
    }
    if (manual) announcement.textContent = `${photos[current].category}: ${photos[current].title}`;
    if (dialog.open) {
      fullImage.src = photos[current].link.href;
      fullImage.alt = photos[current].image.alt;
      fullCaption.textContent = `${photos[current].category} — ${photos[current].title}`;
    }
  }

  function goTo(index, manual = false) {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;
    // Keep keyboard focus out of a slide before it becomes hidden to assistive tech.
    if (track.contains(document.activeElement) && document.activeElement !== track) track.focus({ preventScroll: true });
    current = next;
    sync(manual);
    schedule();
  }

  photos.forEach((photo, index) => {
    photo.link.style.setProperty("--gallery-image", `url("${photo.image.src}")`);
    photo.image.draggable = false;
    photo.link.draggable = false;
    slides[index].setAttribute("role", "group");
    slides[index].setAttribute("aria-roledescription", "slayt");
    slides[index].setAttribute("aria-label", photo.title);

    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "gallery-thumbnail";
    thumb.setAttribute("aria-label", `${photo.category}: ${photo.title} fotoğrafını göster`);
    const image = document.createElement("img");
    image.src = photo.image.dataset.galleryThumb || photo.image.src;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    thumb.append(image);
    thumb.addEventListener("click", () => goTo(index, true));
    thumbnails.append(thumb);

    photo.link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      current = index;
      dialog.showModal();
      document.body.classList.add("gallery-modal-open");
      sync();
      schedule();
    });
  });

  gallery.querySelector("[data-gallery-previous]").addEventListener("click", () => goTo(current - 1, true));
  gallery.querySelector("[data-gallery-next]").addEventListener("click", () => goTo(current + 1, true));
  dialog.querySelector("[data-gallery-full-previous]").addEventListener("click", () => goTo(current - 1, true));
  dialog.querySelector("[data-gallery-full-next]").addEventListener("click", () => goTo(current + 1, true));
  dialog.querySelector("[data-gallery-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("gallery-modal-open");
    // Navigation in the lightbox may have changed the active photo.
    photos[current].link.focus({ preventScroll: true });
    schedule();
  });

  function arrowKeys(event) {
    const inThumbnails = thumbnails.contains(event.target);
    const verticalKeys = inThumbnails && !mobileLayout.matches && ["ArrowUp", "ArrowDown"].includes(event.key);
    if (!verticalKeys && event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goTo(current + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1), true);
    if (inThumbnails) thumbnails.children[current].focus({ preventScroll: true });
  }
  gallery.addEventListener("keydown", arrowKeys);
  dialog.addEventListener("keydown", arrowKeys);
  autoplay.addEventListener("click", () => { wantsAutoplay = !wantsAutoplay; schedule(); });
  section.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { hovered = true; schedule(); } });
  section.addEventListener("pointerleave", () => { hovered = false; schedule(); });
  function updateFocus() {
    focused = section.contains(document.activeElement) && document.activeElement !== autoplay;
    schedule();
  }
  section.addEventListener("focusin", updateFocus);
  section.addEventListener("focusout", () => queueMicrotask(updateFocus));
  // Horizontal gestures navigate; vertical gestures retain normal page scrolling.
  track.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    gestureStart = { x: event.clientX, y: event.clientY };
    dragging = true;
    schedule();
  }, { passive: true });
  track.addEventListener("pointerup", (event) => {
    if (gestureStart) {
      const dx = event.clientX - gestureStart.x;
      const dy = event.clientY - gestureStart.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        suppressClickUntil = Date.now() + 500;
        goTo(current + (dx < 0 ? 1 : -1), true);
      }
    }
    gestureStart = null;
    dragging = false;
    schedule();
  }, { passive: true });
  function endGesture() { gestureStart = null; dragging = false; schedule(); }
  track.addEventListener("pointercancel", endGesture, { passive: true });
  track.addEventListener("pointerleave", endGesture, { passive: true });
  track.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", () => { wantsAutoplay = !motion.matches; schedule(); });
  mobileLayout.addEventListener("change", () => sync());

  new IntersectionObserver(([entry]) => { visible = entry.intersectionRatio >= 0.25; schedule(); }, { threshold: 0.25 }).observe(gallery);

  if (slides.length > 1) {
    gallery.querySelectorAll("[data-gallery-previous], [data-gallery-next], [data-gallery-thumbnails]").forEach((control) => { control.hidden = false; });
    autoplay.hidden = false;
  }
  gallery.classList.add("is-ready");
  sync();
  schedule();
})();
