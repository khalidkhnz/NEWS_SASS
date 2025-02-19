import { ExternalToast, toast } from "sonner";

export class Toast {
  public static default(
    message: string | React.ReactNode,
    data?: ExternalToast
  ) {
    toast(message, {
      style: { borderRadius: 0, border: 0 },
      className: "",
      ...data,
    });
  }

  public static success(
    message: string | React.ReactNode,
    data?: ExternalToast
  ) {
    toast.success(message, {
      className: "",
      ...data,
    });
  }

  public static warning(
    message: string | React.ReactNode,
    data?: ExternalToast
  ) {
    toast.warning(message, {
      className: "",
      ...data,
    });
  }

  public static error(message: string | React.ReactNode, data?: ExternalToast) {
    toast.error(message, {
      className: "",
      ...data,
    });
  }

  public static info(message: string | React.ReactNode, data?: ExternalToast) {
    toast.info(message, {
      className: "",
      ...data,
    });
  }

  public static loading(
    message: string | React.ReactNode,
    data?: ExternalToast
  ) {
    toast.loading(message, {
      className: "",
      ...data,
    });
  }

  public static promise<T>({
    promise,
    onError,
    onSuccess,
    onloading,
    description,
  }: {
    promise: Promise<T>;
    onSuccess?: (data: T) => string;
    onloading?: string | React.ReactNode;
    onError?: string | React.ReactNode;
    description?: string | React.ReactNode;
  }) {
    toast.promise(promise, {
      success: (data) => {
        if (onSuccess) {
          return onSuccess(data);
        }
        return "Promise Resolved";
      },
      loading: onloading || "Loading...",
      error: onError || "Error",
      description,
      className: "",
    });
  }
}
