// Theme switcher (Pastel Light default <-> Pastel Dark)
const themeToggle = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", theme);

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(isDark));
        const nextLabel = isDark ? "Switch to light pastel theme" : "Switch to dark theme";
        themeToggle.setAttribute("aria-label", nextLabel);
        themeToggle.setAttribute("title", nextLabel);
    }

    if (themeMeta) {
        themeMeta.setAttribute("content", isDark ? "#101321" : "#fbf8fd");
    }

    try {
        localStorage.setItem("portfolio-theme", theme);
    } catch (e) {
        // Ignore storage errors in restricted environments
    }
}

if (themeToggle) {
    const initialTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(initialTheme);

    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
    });
}

// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

function closeMobileMenu() {
    if (!menuBtn || !navMenu) return;
    navMenu.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation menu");
}

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });
}

// One-click copy email for recruiters
document.querySelectorAll(".copy-email-btn").forEach((button) => {
    const labelEl = button.querySelector(".copy-label");
    const defaultLabel = labelEl ? labelEl.textContent : "Copy Email";
    let resetTimer;

    button.addEventListener("click", async () => {
        const email = button.getAttribute("data-email") || "rhishikanpavithran@gmail.com";
        let copied = false;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
                copied = true;
            }
        } catch (e) {
            copied = false;
        }

        if (!copied) {
            const tempInput = document.createElement("input");
            tempInput.value = email;
            tempInput.setAttribute("readonly", "");
            tempInput.style.position = "absolute";
            tempInput.style.left = "-9999px";
            document.body.appendChild(tempInput);
            tempInput.select();
            try {
                copied = document.execCommand("copy");
            } catch (e) {
                copied = false;
            }
            document.body.removeChild(tempInput);
        }

        if (labelEl) {
            labelEl.textContent = copied ? "Copied!" : email;
        }
        button.classList.add("copied");

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            if (labelEl) {
                labelEl.textContent = defaultLabel;
            }
            button.classList.remove("copied");
        }, 2200);
    });
});

// Active nav link on scroll + progressive scroll reveal
const navLinks = Array.from(document.querySelectorAll('#navMenu a[href^="#"]'));
const sections = Array.from(document.querySelectorAll("main section[id]"));

if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    const isMatch = link.getAttribute("href") === `#${id}`;
                    link.classList.toggle("active-link", isMatch);
                });
            });
        },
        { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReducedMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-ready");
    const revealTargets = document.querySelectorAll(
        ".recruiter-stat, .about-highlight, .skill-group, .specialization-card, .timeline-item, .project-card, .education-card"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealTargets.forEach((el) => {
        el.classList.add("reveal");
        revealObserver.observe(el);
    });
}

// Automatically update the copyright year
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
