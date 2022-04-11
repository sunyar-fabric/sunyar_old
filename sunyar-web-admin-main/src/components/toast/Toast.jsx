import React, { useEffect, useState } from 'react';
import './toast.css';

const Toast = ({ detail, type, id }) => {
    const [percent, setPercent] = useState(1);

    useEffect(() => {
        setTimeout(() => {
            if (percent < 100) setPercent(percent + 2);
            else if (percent >= 100) {
                document.getElementById(`toast-div-${id}`).style.display =
                    'none';
            }
        }, 100);
    }, [percent]);

    let currentState;
    let icon;

    switch (type) {
        case 'success':
            currentState = 'success';
            icon = 'fa-check';

            break;
        case 'error':
            currentState = 'danger';
            icon = 'fa-times-circle-o';
            break;
        case 'warning':
            currentState = 'warning';
            icon = 'fa-exclamation-triangle';

            break;
        case 'info':
            currentState = 'info';
            icon = 'fa-info-circle';

            break;
        default:
            icon = 'fa-info-circle';
            currentState = 'success';
    }

    return (
        <div className="m-md-2 border bg-white mytoast" id={`toast-div-${id}`}>
            <div>
                <div className="progress">
                    <div
                        className={`progress-bar bg-${currentState}`}
                        role="progressbar"
                        style={{ width: `${percent}%` }}
                        aria-valuenow={percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
                <div className="d-flex align-content-center align-items-center w-100 p-2">
                    <i
                        className={`fa ${icon} text-${currentState}`}
                        aria-hidden="true"
                        style={{ fontSize: '30px' }}
                    ></i>
                    <p className="p-0 m-0 mx-2 font-weight-lighter text-justify toast-detail">
                        {detail}
                    </p>
                    <i
                        className={`fa fa-times ml-0 mr-auto align-self-start text-${currentState}`}
                        style={{ fontSize: '20px' }}
                        onClick={() =>
                            (document.getElementById(
                                `toast-div-${id}`
                            ).style.display = 'none')
                        }
                        aria-hidden="true"
                    ></i>
                </div>
            </div>
        </div>
    );
};

export default Toast;
