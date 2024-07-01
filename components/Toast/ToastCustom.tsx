import { toast, ToastOptions, ToastPosition } from "react-toastify";

export enum ToastType {
  Success = "success",
  Error = "error",
}

interface CustomToastOptions extends ToastOptions {
  position: ToastPosition;
}

const showToast = (
  message: string,
  type: ToastType,
  options?: Partial<CustomToastOptions>
) => {
  const defaultOptions: CustomToastOptions = {
    autoClose: type === ToastType.Success ? 1000 : 5000,
    position: "top-right",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    ...(options || {}),
  };

  switch (type) {
    case ToastType.Success:
      toast.success(message, defaultOptions);
      break;
    case ToastType.Error:
      toast.error(message, defaultOptions);
      break;
    default:
      break;
  }
};

export default showToast;
