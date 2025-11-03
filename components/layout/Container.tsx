import React from "react";

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Container({
  size = 'lg',
  children,
  className = "",
  padding = true,
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl", 
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "max-w-7xl",
  };

  const paddingClass = padding ? "px-4" : "";
  const containerClasses = `${sizeClasses[size]} mx-auto ${paddingClass} ${className} min-h-screen flex flex-col justify-center`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}