// utils/toast.js
import { toast } from "sonner";

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
};

export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    duration: 3500,
    position: "top-right",
  });
};
