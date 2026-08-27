document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  const primaryLink = card.querySelector(".project-links a:not(.link-disabled)");
  if (primaryLink) {
    primaryLink.classList.add("card-stretched-link");
    card.classList.add("has-link");
  }
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(
    ".section > h2, .section-note, .project-card, .experience-item, .skills-list, .contact-list"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const current =
    document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

const heroRobot = document.querySelector(".hero-robot");
const heroSection = document.getElementById("home");

if (heroRobot && heroSection && !prefersReducedMotion) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const pupilLeft = document.getElementById("pupil-left");
  const pupilRight = document.getElementById("pupil-right");
  const eyeBaseLeft = { cx: 90, cy: 80 };
  const eyeBaseRight = { cx: 110, cy: 80 };
  const maxPupilOffset = 3;

  const updateEyes = (clientX, clientY) => {
    const rect = heroRobot.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const pivotY = rect.top + rect.height * 0.32;
    const dx = clamp((clientX - pivotX) / 260, -1, 1) * maxPupilOffset;
    const dy = clamp((clientY - pivotY) / 260, -1, 1) * maxPupilOffset;

    pupilLeft.setAttribute("cx", eyeBaseLeft.cx + dx);
    pupilLeft.setAttribute("cy", eyeBaseLeft.cy + dy);
    pupilRight.setAttribute("cx", eyeBaseRight.cx + dx);
    pupilRight.setAttribute("cy", eyeBaseRight.cy + dy);
  };

  heroSection.addEventListener("mousemove", (e) => updateEyes(e.clientX, e.clientY));
  heroSection.addEventListener("mouseleave", () => {
    pupilLeft.setAttribute("cx", eyeBaseLeft.cx);
    pupilLeft.setAttribute("cy", eyeBaseLeft.cy);
    pupilRight.setAttribute("cx", eyeBaseRight.cx);
    pupilRight.setAttribute("cy", eyeBaseRight.cy);
  });

  const playWave = () => {
    heroRobot.classList.remove("is-waving");
    // Force reflow so the animation restarts if clicked again quickly.
    void heroRobot.offsetWidth;
    heroRobot.classList.add("is-waving");
  };

  heroRobot.addEventListener("click", playWave);
  heroRobot.addEventListener("touchstart", playWave, { passive: true });

  const waveArm = heroRobot.querySelector(".robot-arm-right");
  waveArm.addEventListener("animationend", () => heroRobot.classList.remove("is-waving"));
}
