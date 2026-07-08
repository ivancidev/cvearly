"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all outline-none focus:ring-2 focus:ring-zinc-800 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";
    
    const variants = {
      primary: "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm",
      secondary: "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-800",
      outline: "border border-zinc-800 text-zinc-300 hover:bg-zinc-900/50 hover:text-white bg-transparent",
      ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-5 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className={cn(
              "animate-spin -ml-1 mr-3 h-4 w-4",
              variant === "primary" ? "text-zinc-950" : "text-white"
            )}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
