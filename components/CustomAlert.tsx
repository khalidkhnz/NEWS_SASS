import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "default_custom" | "confirmation";
  component?: any;
  contentParentClassName?: string;
  buttonParentClassName?: string;
  className?: string;
  confirmationTitle?: string;
  confirmationParagraph?: string;
  confirmationButtonText?: string;
  disabled?: boolean;
  onConfirm?: () => void;
  trigger: any;
};

const CustomAlert = ({
  variant = "default_custom",
  component,
  buttonParentClassName,
  contentParentClassName,
  className,
  confirmationTitle = "Are you absolutely sure?",
  confirmationParagraph = "This action cannot be undone. This will permanently delete and remove this data from our servers.",
  confirmationButtonText = "Continue",
  disabled = false,
  onConfirm = () => {},
  trigger,
  ...props
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled} className={cn(className)}>
        <div className={cn(buttonParentClassName)}>{trigger}</div>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          {
            "m-0 h-fit w-fit rounded-none border-none p-0":
              variant === "default_custom",
          },
          contentParentClassName
        )}
        {...props}
      >
        {variant === "default_custom" && (
          <>
            <AlertDialogHeader className="hidden">
              <AlertDialogTitle>{confirmationTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmationParagraph}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {component}
          </>
        )}
        {variant === "confirmation" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmationTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmationParagraph}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm}>
                {confirmationButtonText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
