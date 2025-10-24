import { useEffect, useState } from "react";

// Define the sections in order
const sections = [
  { id: "hero", hash: "" }, // Home section has no hash
  { id: "problems", hash: "#problems" },
  { id: "services", hash: "#services" },
  { id: "approach", hash: "#approach" },
  { id: "case-study", hash: "#case-study" },
  { id: "about", hash: "#about" },
  { id: "contact", hash: "#contact" },
];

export const useScrollHash = () => {
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    // Handle initial hash on page load
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setCurrentHash(hash);
        }
      }
    };

    // Call after a short delay to ensure DOM is ready
    setTimeout(handleInitialHash, 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Get all section elements
      const sectionElements = sections
        .map((section) => ({
          ...section,
          element: document.getElementById(section.id),
        }))
        .filter((section) => section.element);

      // Find which section is currently most visible
      let currentSection = sections[0]; // Default to hero
      let maxVisibility = 0;

      sectionElements.forEach((section) => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate how much of the section is visible
          const visibleTop = Math.max(0, -rect.top);
          const visibleBottom = Math.min(rect.height, windowHeight - rect.top);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibility = visibleHeight / windowHeight;

          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            currentSection = section;
          }
        }
      });

      // Update URL hash if it changed
      if (currentSection.hash !== currentHash) {
        setCurrentHash(currentSection.hash);

        // Update browser URL without triggering a scroll
        const newUrl = window.location.pathname + currentSection.hash;
        window.history.replaceState(null, "", newUrl);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    const scrollContainer = document.querySelector("main");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }

    // Fallback to window scroll if main container not found
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentHash]);

  // Handle hash changes (when user manually changes URL or uses back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash !== currentHash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setCurrentHash(hash);
        }
      } else if (!hash && currentHash) {
        // Navigate to hero section
        const heroElement = document.getElementById("hero");
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: "smooth" });
          setCurrentHash("");
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [currentHash]);

  return currentHash;
};