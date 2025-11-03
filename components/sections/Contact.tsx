"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { WhatsAppButton } from "@/components/forms/WhatsAppButton";
import { FormField } from "@/components/forms/FormField";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/layout/Container";
import { useRevealAnimation } from "@/lib/hooks/useRevealAnimation";

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

  const sectionAnimation = useRevealAnimation({ 
    distance: 50, 
    duration: 0.8 
  });
  const dividerAnimation = useRevealAnimation({ delay: 0.3 });
  const formAnimation = useRevealAnimation({ delay: 0.4 });

  return (
    <motion.div {...sectionAnimation}>
      <section id="contact" className="pt-8">
        <Container size="md">
          <SectionHeader title={t("contact.title")} />

          {/* WhatsApp Quick Contact */}
          <WhatsAppButton source="contact_section" delay={0.2} />

          {/* Divider */}
          <motion.div
            {...dividerAnimation}
            className="flex items-center my-12"
          >
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
              {t("contact.form.orDetailed")}
            </span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            {...formAnimation}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
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
        </Container>
      </section>
    </motion.div>
  );
}