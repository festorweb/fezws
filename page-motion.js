// Register before the first paint so document transitions use a fully visible snapshot.
window.addEventListener("pagereveal", (event) => {
  if (!event.viewTransition) return;
  document.documentElement.classList.add("has-document-transition");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    event.viewTransition.skipTransition();
  }
});
