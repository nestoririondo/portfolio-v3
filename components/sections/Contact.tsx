"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { WhatsAppButton } from "@/components/forms/WhatsAppButton";
import { FormField } from "@/components/forms/FormField";

export function Contact() {
  const { t } = useLanguage();
  const {
    formData,
    isSubmitting,
    errors,
    PROJECT_TYPES,
    handleSubmit,
    handleChange,
  } = useContactForm();

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
          {/* Section Header */}
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
          <WhatsAppButton source="contact_section" delay={0.2} />

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

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Name Field */}
            <FormField
              type="text"
              label={t("contact.form.name")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            {/* Email Field */}
            <FormField
              type="email"
              label={t("contact.form.email")}
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {/* Company Field */}
            <FormField
              type="text"
              label={t("contact.form.company")}
              name="company"
              value={formData.company}
              onChange={handleChange}
              optional
            />

            {/* Project Type Field */}
            <FormField
              label={t("contact.form.projectType")}
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              error={errors.projectType}
              required
              options={PROJECT_TYPES}
              showEstimate
            />

            {/* Message Field */}
            <FormField
              type="textarea"
              label={t("contact.form.message")}
              name="message"
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              required
              placeholder={t("contact.form.placeholder")}
            />

            {/* Submit Button */}
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
            </div>
          </motion.form>
        </div>
      </section>
    </motion.div>
  );
}