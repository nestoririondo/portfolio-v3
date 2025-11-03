"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: boolean;
  required?: boolean;
  optional?: boolean;
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "email";
  placeholder?: string;
}

interface TextAreaFieldProps extends BaseFieldProps {
  type: "textarea";
  placeholder?: string;
}

interface RadioFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  required?: boolean;
  options: Array<{
    value: string;
    label: string;
    price?: string;
  }>;
  showEstimate?: boolean;
}

type FormFieldProps = TextFieldProps | TextAreaFieldProps | RadioFieldProps;

function isRadioField(props: FormFieldProps): props is RadioFieldProps {
  return 'options' in props;
}

function isTextAreaField(props: FormFieldProps): props is TextAreaFieldProps {
  return 'type' in props && props.type === 'textarea';
}

export function FormField(props: FormFieldProps) {
  const { t } = useLanguage();

  // Radio field component
  if (isRadioField(props)) {
    const { label, name, value, onChange, error, required, options, showEstimate } = props;
    
    return (
      <div className={`space-y-3 ${error ? "animate-shake" : ""}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span>*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={`inline-flex items-center px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer text-sm font-medium ${
                value === option.value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
              } ${
                error
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : ""
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        {value && showEstimate && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-600 dark:text-gray-400 font-medium"
          >
            {t("contact.form.estimatedRange")}{" "}
            {options.find((option) => option.value === value)?.price}
          </motion.div>
        )}
      </div>
    );
  }

  // Regular input and textarea fields
  const { label, name, value, onChange, error, required, optional } = props;
  const inputClassName = `w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    error
      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
  } text-gray-900 dark:text-white`;

  return (
    <div className={`space-y-2 ${error ? "animate-shake" : ""}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label} 
        {required && <span>*</span>}
        {optional && (
          <span className="text-gray-400 text-xs">
            {" "}({t("contact.form.optional")})
          </span>
        )}
      </label>
      
      {isTextAreaField(props) ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${inputClassName} h-30 resize-none`}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={props.type}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClassName}
          placeholder={props.placeholder}
        />
      )}
    </div>
  );
}