/**
 * Scroll utility functions
 */

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
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