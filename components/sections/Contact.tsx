"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import { Footer } from "../layout/Footer";

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

      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          projectType: formData.projectType,
          message: formData.message,
          budget: formData.price ? t(formData.price) : "",
          _subject: `New contact form submission from ${formData.name}`,
        }),
      });

      if (response.ok) {
        toast.custom(() => (
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800 shadow-lg">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[var(--checkmark)]" />
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
        value: "api",
        label: t("contact.form.project.api"),
        price: "€1K - €5K",
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

  const REASONS = useMemo(
    () => [
      t("contact.form.benefit.consultation"),
      t("contact.form.benefit.response"),
      t("contact.form.benefit.flexible"),
    ],
    [t]
  );

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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              {REASONS.map((reason, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0.5 + index * 0.5 }}
                  key={reason}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-[var(--checkmark)]" />
                  {reason}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`block p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      formData.projectType === type.value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                    }
                       ${
                         errors.projectType
                           ? "border-red-500! bg-red-50 dark:bg-red-900/20"
                           : ""
                       }
                      `}
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={type.value}
                      checked={formData.projectType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="font-medium">{type.label}</div>
                    <div
                      className={`text-sm ${
                        formData.projectType === type.value
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {type.price}
                    </div>
                  </label>
                ))}
              </div>
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
                className="btn-primary w-full !py-6 !text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("contact.form.sending")
                  : t("contact.form.benefit.consultation")}
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                🔒 {t("contact.form.privacy")}
              </p>
            </div>
          </motion.form>
        </div>

        <Footer />
      </section>
    </motion.div>
  );
}
