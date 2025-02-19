"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";

interface CButtonProps extends ButtonProps {
  gradient?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CButtonProps>(
  ({ className, variant, children, gradient, ...props }, ref) => {
    return (
      <Button
        variant={variant}
        className={cn("ripple", className)}
        style={{
          background: gradient
            ? "linear-gradient(92.96deg, #A001B9 0.39%, #002CCC 106.07%)"
            : undefined,
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = "Button";

export default CustomButton;
