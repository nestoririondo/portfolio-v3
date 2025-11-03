export interface ProjectType {
  value: string;
  label: string;
  price: string;
}

interface ProjectTypeConfig {
  value: string;
  labelKey: string;
  price?: string;
  priceKey?: string;
}

// Project types configuration - centralized from Contact component
export const PROJECT_TYPES_CONFIG: ProjectTypeConfig[] = [
  {
    value: "website",
    labelKey: "contact.form.project.website",
    price: "€2K - €5K",
  },
  {
    value: "webapp",
    labelKey: "contact.form.project.webapp", 
    price: "€5K - €12K",
  },
  {
    value: "ecommerce",
    labelKey: "contact.form.project.ecommerce",
    price: "€3K - €12K",
  },
  {
    value: "maintenance",
    labelKey: "contact.form.project.maintenance",
    price: "€500 - €2K",
  },
  {
    value: "other",
    labelKey: "contact.form.project.other",
    priceKey: "contact.form.project.discuss",
  },
];

// Helper function to get project types with translations
export function getProjectTypes(t: (key: string) => string): ProjectType[] {
  return PROJECT_TYPES_CONFIG.map((type) => ({
    value: type.value,
    label: t(type.labelKey),
    price: type.priceKey ? t(type.priceKey) : type.price!,
  }));
}