(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  let frame = 0;
  const updateProgress = () => {
    const max = root.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    root.style.setProperty("--scroll", value.toFixed(4));
    frame = 0;
  };

  const requestProgress = () => {
    if (!frame) {
      frame = requestAnimationFrame(updateProgress);
    }
  };

  updateProgress();
  window.addEventListener("scroll", requestProgress, { passive: true });
  window.addEventListener("resize", requestProgress, { passive: true });

  if (finePointer && !reduceMotion) {
    const content = document.querySelector(".content");

    if (content) {
      let lightFrame = 0;
      let x = 0;
      let y = 0;

      content.addEventListener(
        "pointermove",
        (event) => {
          const rect = content.getBoundingClientRect();
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;

          if (!lightFrame) {
            lightFrame = requestAnimationFrame(() => {
              content.style.setProperty("--mx", `${x}px`);
              content.style.setProperty("--my", `${y}px`);
              lightFrame = 0;
            });
          }
        },
        { passive: true }
      );
    }
  }
})();