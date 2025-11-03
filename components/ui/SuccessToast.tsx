"use client";

import { CheckCircle } from "lucide-react";

interface SuccessToastProps {
  message: string;
}

export function SuccessToast({ message }: SuccessToastProps) {
  return (
    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300 dark:border-green-700 shadow-lg">
      <div className="shrink-0">
        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
      </div>
      <span className="text-green-800 dark:text-green-200 font-medium">
        {message}
      </span>
    </div>
  );
}