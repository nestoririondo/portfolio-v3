import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { scrollToContact } from "@/lib/utils/scroll";
import { trackEvent } from "@/lib/posthog";
import { getProjectTypes } from "@/lib/config/projects";
import { SuccessToast } from "@/components/ui/SuccessToast";

const DEFAULT_STATE = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
  price: "",
};

export function useContactForm() {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [timeouts, setTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const { t } = useLanguage();

  const PROJECT_TYPES = useMemo(() => getProjectTypes(t), [t]);

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
        // Track successful form submission
        trackEvent("contact_form_submitted", {
          project_type: formData.projectType,
          has_company: !!formData.company,
          has_budget: !!formData.price,
          budget: formData.price ? t(formData.price) : null,
        });

        toast.custom(() => React.createElement(SuccessToast, { message: t("contact.form.success") }));
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

  return {
    formData,
    isSubmitting,
    errors,
    PROJECT_TYPES,
    handleSubmit,
    handleChange,
    validateForm,
  };
}