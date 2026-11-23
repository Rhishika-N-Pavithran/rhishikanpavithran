// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close the mobile menu after selecting a section
    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Open navigation menu");
        });
    });

    // Close the menu when switching back to desktop width
    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            navMenu.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Open navigation menu");
        }
    });
}

// Automatically update the copyright year
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
