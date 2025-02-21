"use client";

import React from "react";
import { Input, InputProps } from "./ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface CustomInputProps extends InputProps {
  isFloatingLabel?: boolean;
  label?: string;
  onEndIcon?: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  parentClassName?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      type,
      isFloatingLabel,
      label,
      placeholder,
      required,
      onEndIcon,
      error,
      hint,
      parentClassName,
      ...props
    },
    ref
  ) => {
    if (isFloatingLabel) {
      return (
        <div className={cn("w-full", parentClassName)}>
          <div className="flex">
            <div className="w-full">
              <Input
                type={type}
                className={cn(
                  "peer w-full rounded-lg border bg-transparent px-4 py-3 text-sm transition-all duration-200",
                  "border-gray-200 text-gray-900 placeholder-transparent",
                  "hover:border-gray-300",
                  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-600",
                  "dark:focus:border-primary dark:focus:ring-primary/20",
                  error &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                  className
                )}
                ref={ref}
                {...props}
                placeholder={placeholder}
              />
              <Label
                className={cn(
                  "mt-2 block scale-75 bg-white px-2 text-sm text-gray-500 transition-all duration-200",
                  "peer-focus:text-primary",
                  "dark:bg-gray-900 dark:text-gray-400 dark:peer-focus:text-primary",
                  error && "text-red-500 peer-focus:text-red-500"
                )}
              >
                {placeholder}
                {required && <span className="ml-0.5 text-red-500">*</span>}
              </Label>
            </div>
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          {hint && !error && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {hint}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={cn("flex w-full flex-col gap-1.5", parentClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium",
              error ? "text-red-500" : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="flex w-full">
          <Input
            type={type}
            id={props.id}
            className={cn(
              "w-full rounded-lg border text-sm transition-all duration-200",
              "border-gray-200 bg-white text-gray-900 placeholder-gray-500",
              "hover:border-gray-300",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
              "dark:placeholder-gray-400 dark:hover:border-gray-600",
              "dark:focus:border-primary dark:focus:ring-primary/20",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              onEndIcon && "pr-10",
              className
            )}
            placeholder={placeholder}
            ref={ref}
            {...props}
          />
          {onEndIcon && (
            <div className="ml-2 flex items-center text-gray-400">
              {onEndIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
