/**
 * Scroll utility functions
 */

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Add a small delay to allow animations to settle
    setTimeout(() => {
      // Use offset to ensure title is fully visible
      const rect = element.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top - 50; // 100px offset from top
      
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }, 100);
  }
};

export const scrollToTop = () => {
  const heroElement = document.getElementById("hero");
  if (heroElement) {
    heroElement.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.history.pushState(null, "", window.location.pathname);
};

export const scrollToContact = () => scrollToSection("contact");

export const scrollToHome = () => scrollToSection("hero");