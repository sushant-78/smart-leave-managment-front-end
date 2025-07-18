import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  warning: (message: string) => {
    toast(message, {
      icon: "⚠️",
      style: {
        background: "#ff9800",
        color: "#fff",
      },
    });
  },
  info: (message: string) => {
    toast(message, {
      icon: "ℹ️",
      style: {
        background: "#2196f3",
        color: "#fff",
      },
    });
  },
};
