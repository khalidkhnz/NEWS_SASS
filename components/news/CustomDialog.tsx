import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

interface IDialogProps {
  TITLE?: any;
  TRIGGER: any;
  CONTENT?: any;
  triggerClassName?: string;
  contentClassName?: string;
}

const DEFAULT_CLASSES =
  "p-0 m-0 w-fit h-fit pt-0 pb-0 pl-0 pr-0 px-0 py-0 mt-0 mb-0 ml-0 mr-0 mx-0 my-0";
const CONTENT_BOX_CLASSES = "p-2";

const CustomDialog = ({
  TITLE,
  TRIGGER,
  CONTENT,
  contentClassName,
  triggerClassName,
}: IDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className={cn(DEFAULT_CLASSES, triggerClassName)}>
        {TRIGGER}
      </DialogTrigger>
      <DialogContent
        className={cn(DEFAULT_CLASSES, CONTENT_BOX_CLASSES, contentClassName)}
      >
        <DialogTitle>{TITLE}</DialogTitle>
        {CONTENT}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
