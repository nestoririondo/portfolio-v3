"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";

const DEFAULT_STATE = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
  price: "",
};

export function Contact() {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [timeouts, setTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const { t } = useLanguage();

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = true;
    if (!formData.projectType.trim()) newErrors.projectType = true;
    if (!formData.message.trim()) newErrors.message = true;

    // Clear any existing timeouts before setting new ones
    Object.values(timeouts).forEach(clearTimeout);
    setTimeouts({});

    setErrors(newErrors);

    // Auto-clear errors after 3 seconds
    if (Object.keys(newErrors).length > 0) {
      scrollToContact();
      const newTimeouts: Record<string, NodeJS.Timeout> = {};

      Object.keys(newErrors).forEach((fieldName) => {
        const timeoutId = setTimeout(() => {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }, 3000);

        newTimeouts[fieldName] = timeoutId;
      });

      setTimeouts(newTimeouts);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("contact.form.validation"));
      return;
    }

    setIsSubmitting(true);

    try {
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
      if (!formspreeId) {
        throw new Error("Formspree form ID not configured");
      }

      const body = JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        projectType: formData.projectType,
        message: formData.message,
        budget: formData.price ? t(formData.price) : "",
        _subject: `New contact form submission from ${formData.name}`,
      });

      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (response.ok) {
        toast.custom(() => (
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800 shadow-lg">
            <div className="shrink-0">
              <CheckCircle className="w-6 h-6 text-(--checkmark)" />
            </div>
            <span className="text-gray-900 dark:text-white font-medium">
              {t("contact.form.success")}
            </span>
          </div>
        ));
        setFormData(DEFAULT_STATE);
        setErrors({});
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error(t("contact.form.error"));
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      // Clear any existing timeouts for this field
      if (timeouts[name]) {
        clearTimeout(timeouts[name]);
        setTimeouts((prev) => {
          const newTimeouts = { ...prev };
          delete newTimeouts[name];
          return newTimeouts;
        });
      }

      // Immediately clear error state
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const PROJECT_TYPES = useMemo(
    () => [
      {
        value: "website",
        label: t("contact.form.project.website"),
        price: "€2K - €5K",
      },
      {
        value: "webapp",
        label: t("contact.form.project.webapp"),
        price: "€5K - €12K",
      },
      {
        value: "ecommerce",
        label: t("contact.form.project.ecommerce"),
        price: "€3K - €12K",
      },
      {
        value: "maintenance",
        label: t("contact.form.project.maintenance"),
        price: "€500 - €2K",
      },
      {
        value: "other",
        label: t("contact.form.project.other"),
        price: t("contact.form.project.discuss"),
      },
    ],
    [t]
  );

  const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <section id="contact" className="pt-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-8">
              {t("contact.title")}
            </h2>
          </motion.div>

          {/* WhatsApp Quick Contact */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href={`https://wa.me/${whatsAppNumber}?text=Hi%20Néstor!%20I%27d%20like%20to%20discuss%20a%20web%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-animated group inline-flex items-center gap-3 bg-[#25d366] border-2 border-[#1C1E21] dark:border-gray-500 text-black hover:text-white dark:hover:text-black px-8 py-4 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-125"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              <span className="relative z-10">
                {t("contact.whatsapp.button")}
              </span>
            </a>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="flex items-center my-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
              {t("contact.form.orDetailed")}
            </span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={`space-y-2 ${errors.name ? "animate-shake" : ""}`}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("contact.form.name")} <span>*</span>
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                } text-gray-900 dark:text-white`}
              />
            </div>

            <div className={`space-y-2 ${errors.email ? "animate-shake" : ""}`}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("contact.form.email")} <span>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                } text-gray-900 dark:text-white`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("contact.form.company")}{" "}
                <span className="text-gray-400 text-xs">
                  ({t("contact.form.optional")})
                </span>
              </label>
              <input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div
              className={`space-y-3 ${
                errors.projectType ? "animate-shake" : ""
              }`}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("contact.form.projectType")} <span>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`inline-flex items-center px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer text-sm font-medium ${
                      formData.projectType === type.value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                    } ${
                      errors.projectType
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={type.value}
                      checked={formData.projectType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
              {formData.projectType && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                >
                  {t("contact.form.estimatedRange")}{" "}
                  {
                    PROJECT_TYPES.find((t) => t.value === formData.projectType)
                      ?.price
                  }
                </motion.div>
              )}
            </div>

            <div
              className={`space-y-2 ${errors.message ? "animate-shake" : ""}`}
            >
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("contact.form.message")} <span>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={`w-full h-30 px-4 py-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.message
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                } text-gray-900 dark:text-white`}
                placeholder={t("contact.form.placeholder")}
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="btn-primary-animated w-full justify-center"
                disabled={isSubmitting}
              >
                <span className="font-semibold">
                  {isSubmitting
                    ? t("contact.form.sending")
                    : t("contact.form.benefit.consultation")}
                </span>
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                🔒 {t("contact.form.privacy")}
              </p>
            </div>
          </motion.form>
        </div>
      </section>
    </motion.div>
  );
}
