"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const problemKeys = [
  "problems.template",
  "problems.manual",
  "problems.integration",
  "problems.design",
  "problems.performance",
  "problems.limited",
];

export function ProblemRecognition() {
  const { t } = useLanguage();

  return (
    <section id="problems" className="section">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <div className="relative mb-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              {t("problems.title")}
            </h2>
            <div className="w-20 h-1 bg-blue-600"></div>
          </div>
          <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            PROBLEMS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {problemKeys.map((problemKey, index) => (
            <div key={index} className="relative group">
              <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-red-500 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-colors duration-300">
                    <X className="w-6 h-6 text-red-600 dark:text-red-400 group-hover:text-white" />
                  </div>
                  <div className="text-sm font-mono text-gray-400 font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(problemKey)}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-600 p-8 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">!</span>
              </div>
              <div className="text-sm font-mono text-yellow-700 dark:text-yellow-400 uppercase tracking-wider font-bold">
                SOLUTION NEEDED
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed ml-12">
              {t("problems.conclusion")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}