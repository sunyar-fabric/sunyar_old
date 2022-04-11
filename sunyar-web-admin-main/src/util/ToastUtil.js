import { tostify } from '../components/toast/ToastContainer';

export const toastSuccess = (message) => {
    tostify(message, 'success');
};

export const toastError = (message) => {
    tostify(message, 'error');
};

export const toastInfo = (message) => {
    tostify(message, 'info');
};

export const toastWarning = (message) => {
    tostify(message, 'warning');
};
