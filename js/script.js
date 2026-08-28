document.getElementById("year").textContent = new Date().getFullYear();

const scrollProgress = document.getElementById("scroll-progress");

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

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
    ".section > h2, .section-note, .project-card, .experience-item, .skills-list li, .contact-list"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  // Stagger elements that share a parent (skill pills, project cards) for a cascading reveal.
  const staggerGroups = document.querySelectorAll(".skills-list, .projects-grid");
  staggerGroups.forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      if (child.classList.contains("reveal")) {
        child.style.transitionDelay = `${Math.min(index * 0.06, 0.4)}s`;
      }
    });
  });

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

const trackedSections = document.querySelectorAll("main section[id]");
const sectionNavLinks = new Map();
navLinks.querySelectorAll("a[href^='#']").forEach((link) => {
  sectionNavLinks.set(link.getAttribute("href").slice(1), link);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = sectionNavLinks.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        sectionNavLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);

trackedSections.forEach((section) => sectionObserver.observe(section));
