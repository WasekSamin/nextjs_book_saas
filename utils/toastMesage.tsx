import { toast, ToastOptions } from 'react-toastify';

type TOAST_TYPE = {
    toastType: string,
    msg: string,
    isDark: boolean,
    autoClose?: number
}

export const makeToast = ({toastType, msg, isDark, autoClose=5000}: TOAST_TYPE) => {
    const toastOptions: ToastOptions = {
        position: "top-right",
        theme: isDark ? "dark" : "light",
        autoClose: autoClose
    }

    switch(toastType) {
        case "success":
            toast.success(msg, toastOptions);
            break;
        case "error":
            toast.error(msg, toastOptions);
            break;
        case "warn":
            toast.warn(msg, toastOptions);
            break;
        case "info":
            toast.info(msg, toastOptions);
            break;
    }
}