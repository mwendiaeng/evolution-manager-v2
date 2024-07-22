import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class CustomToastService {
  private defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  public success(message: string, options?: ToastOptions) {
    toast.success(message, { ...this.defaultOptions, ...options });
  }

  public error(message: string, options?: ToastOptions) {
    toast.error(message, { ...this.defaultOptions, ...options });
  }

  public info(message: string, options?: ToastOptions) {
    toast.info(message, { ...this.defaultOptions, ...options });
  }

  public warning(message: string, options?: ToastOptions) {
    toast.warning(message, { ...this.defaultOptions, ...options });
  }
}

const toastService = new CustomToastService();
export default toastService;
