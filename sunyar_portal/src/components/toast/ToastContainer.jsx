import React, { useEffect, useState } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    const [toast, setToast] = useState();

    useEffect(() => {
        document
            .getElementById('toast-container')
            .addEventListener('toast-add', (e) => {
                setToast({
                    detail: e.detail.detail,
                    type: e.detail.type,
                    id: new Date().getTime(),
                });
            });
    }, []);

    useEffect(() => {
        if (toast) {
            let tt = [...toasts];
            tt.push(toast);
            setToasts(tt);
        }
    }, [toast]);

    return (
        <div id="toast-container" className="toast-main d-flex flex-column" >
            {toasts.map((toast, index) => (
                <Toast
                    key={index}
                    detail={toast.detail}
                    type={toast.type}
                    id={toast.id}
                />
            ))}
        </div>
    );
};

export const tostify = (detail, type) => {
    var evt = new CustomEvent('toast-add', { detail: { detail, type } });
    if (document.getElementById('toast-container'))
        document.getElementById('toast-container').dispatchEvent(evt);
};

export default ToastContainer;
