export const personalJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Person", "ProfessionalService"],
  "name": "Néstor Iriondo",
  "jobTitle": "Full-Stack Web Developer",
  "description": "Full-stack web developer with 5+ years experience specializing in React, Next.js, and custom web applications for Berlin businesses. Professional software developer at Murrelektronik with expertise in industrial IoT platforms.",
  "url": "https://nestoririondo.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Berlin",
    "addressCountry": "Germany",
    "addressRegion": "Berlin"
  },
  "sameAs": [
    "https://github.com/nestoririondo",
    "https://linkedin.com/in/nestor-iriondo"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Software Developer",
    "occupationLocation": {
      "@type": "City",
      "name": "Berlin"
    }
  },
  "offers": {
    "@type": "Offer",
    "description": "Custom website development, web applications, API integrations, e-commerce development, website maintenance, and technical consulting",
    "areaServed": "Berlin, Germany"
  }
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Néstor Iriondo - Web Developer Berlin",
  "url": "https://nestoririondo.com",
  "description": "Professional web development services in Berlin. Custom websites, web applications, and API integrations for local businesses.",
  "inLanguage": ["en", "es", "de"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nestoririondo.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};